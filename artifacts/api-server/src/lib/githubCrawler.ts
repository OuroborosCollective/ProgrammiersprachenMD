import { logger } from "./logger";
import { listLanguages } from "./knowledgeBase";
import { writeBugfixGuide } from "./bugfixKnowledge";
import { updateLastGithubCrawled } from "./knowledgeBase";

const GH_API = "https://api.github.com";

// Map language slugs to GitHub's language names for search
const GH_LANGUAGE_NAMES: Record<string, string> = {
  cpp: "C++",
  csharp: "C#",
  c: "C",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  ruby: "Ruby",
  php: "PHP",
  scala: "Scala",
  haskell: "Haskell",
  elixir: "Elixir",
  lua: "Lua",
  r: "R",
  julia: "Julia",
  dart: "Dart",
  sql: "PLpgSQL",
  bash: "Shell",
};

// Common bug-fix keywords to search in commit messages
const FIX_KEYWORDS = ["fix", "bug fix", "bugfix", "fixes #", "closes #", "resolve", "patch"];

interface GHRepo {
  full_name: string;
  html_url: string;
  stargazers_count: number;
  description: string | null;
  default_branch: string;
}

interface GHCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

interface GHTreeItem {
  path: string;
  type: "blob" | "tree";
}

interface GHRateLimit {
  remaining: number;
  reset: number;
}

async function ghFetch(url: string, acceptHeader?: string): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 12000);
  try {
    const headers: Record<string, string> = {
      "User-Agent": "ProgLangKnowledgeBase/1.0 (educational, public-api-only)",
      "Accept": acceptHeader ?? "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    // Use GITHUB_TOKEN env var if available (optional, raises rate limit to 5000/hr)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    return await fetch(url, { signal: controller.signal, headers });
  } finally {
    clearTimeout(id);
  }
}

function parseRateLimit(res: Response): GHRateLimit {
  return {
    remaining: parseInt(res.headers.get("x-ratelimit-remaining") ?? "60", 10),
    reset: parseInt(res.headers.get("x-ratelimit-reset") ?? "0", 10),
  };
}

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/** Search top repos for a language, sorted by stars. */
async function fetchTopRepos(langName: string, count = 4): Promise<GHRepo[]> {
  const q = encodeURIComponent(`language:${langName} stars:>500 is:public`);
  const url = `${GH_API}/search/repositories?q=${q}&sort=stars&order=desc&per_page=${count}`;
  const res = await ghFetch(url);
  if (!res.ok) return [];
  const data = await res.json() as { items?: GHRepo[] };
  return data.items ?? [];
}

/** Search recent fix commits in a repo. */
async function fetchFixCommits(repo: string, count = 8): Promise<GHCommit[]> {
  // Use the commits list endpoint filtered by message rather than search API
  // to avoid the stricter search-API rate limit
  const url = `${GH_API}/repos/${repo}/commits?per_page=${count}`;
  const res = await ghFetch(url);
  if (!res.ok) return [];
  const commits = await res.json() as GHCommit[];
  if (!Array.isArray(commits)) return [];

  // Filter locally to commits that look like bug fixes
  return commits.filter((c) => {
    const msg = c.commit.message.toLowerCase();
    return FIX_KEYWORDS.some((kw) => msg.includes(kw));
  });
}

/** Fetch the unified diff for a single commit. */
async function fetchCommitDiff(repo: string, sha: string): Promise<string | null> {
  const url = `${GH_API}/repos/${repo}/commits/${sha}`;
  const res = await ghFetch(url, "application/vnd.github.v3.diff");
  if (!res.ok) return null;
  const rl = parseRateLimit(res);
  if (rl.remaining < 5) {
    logger.warn({ remaining: rl.remaining }, "GitHub rate limit almost exhausted, stopping diff fetches");
    return null;
  }
  const diff = await res.text();
  // Truncate very long diffs
  return diff.length > 6000 ? diff.slice(0, 6000) + "\n... (truncated)" : diff;
}

/** Fetch repo file tree and extract a concise directory structure. */
async function fetchRepoTree(repo: string, branch: string): Promise<string | null> {
  const url = `${GH_API}/repos/${repo}/git/trees/${branch}?recursive=1`;
  const res = await ghFetch(url);
  if (!res.ok) return null;
  const data = await res.json() as { tree?: GHTreeItem[]; truncated?: boolean };
  if (!data.tree) return null;

  // Keep only top-level + one level deep, ignore hidden/vendor dirs
  const IGNORE = new Set(["node_modules", ".git", "vendor", "dist", "build", "__pycache__", ".github"]);
  const items = data.tree
    .filter((item) => {
      const parts = item.path.split("/");
      return parts.length <= 2 && !IGNORE.has(parts[0]);
    })
    .slice(0, 40);

  // Build a tree-like string
  const lines: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const parts = item.path.split("/");
    const root = parts[0];
    if (!seen.has(root)) {
      seen.add(root);
      lines.push(item.type === "tree" ? `├── ${root}/` : `├── ${root}`);
    }
    if (parts.length === 2) {
      lines.push(`│   ├── ${parts[1]}${item.type === "tree" ? "/" : ""}`);
    }
  }

  return lines.join("\n");
}

/** Parse a unified diff into readable before/after blocks per file. */
function parseDiffToMarkdown(diff: string, maxFiles = 2): string {
  const fileBlocks = diff.split(/^diff --git /m).slice(1, maxFiles + 1);
  const sections: string[] = [];

  for (const block of fileBlocks) {
    const firstLine = block.split("\n")[0] ?? "";
    const fileMatch = firstLine.match(/b\/(.+)$/);
    const filename = fileMatch?.[1] ?? "file";

    // Find hunk(s)
    const hunks = block.split(/^@@[^@@]*@@/m).slice(1);
    if (!hunks.length) continue;

    const hunk = hunks[0].split("\n").slice(1, 30).join("\n").trim();
    if (!hunk) continue;

    sections.push(`**Datei:** \`${filename}\`\n\`\`\`diff\n${hunk}\n\`\`\``);
  }

  return sections.join("\n\n");
}

/** Generate a usable project-setup script for the language. */
function generateSetupScript(slug: string, langName: string, repoName?: string): string {
  const scripts: Record<string, string> = {
    python: `# Python-Projekt anlegen
mkdir myproject && cd myproject
python -m venv .venv && source .venv/bin/activate
pip install --upgrade pip
touch main.py requirements.txt README.md
mkdir -p src tests
echo "def main():\\n    pass\\n\\nif __name__ == '__main__':\\n    main()" > src/main.py`,
    typescript: `# TypeScript-Projekt anlegen
mkdir myproject && cd myproject
npm init -y
npm install -D typescript ts-node @types/node
npx tsc --init
mkdir -p src
echo 'export function main(): void { console.log("Hello, TypeScript!"); }' > src/index.ts`,
    javascript: `# Node.js-Projekt anlegen
mkdir myproject && cd myproject
npm init -y
mkdir -p src tests
echo 'function main() { console.log("Hello, Node.js!"); } main();' > src/index.js`,
    rust: `# Rust-Projekt anlegen
cargo new myproject && cd myproject
# Nützliche Crates hinzufügen:
# cargo add serde serde_json anyhow tokio --features tokio/full`,
    go: `# Go-Projekt anlegen
mkdir myproject && cd myproject
go mod init github.com/user/myproject
mkdir -p cmd internal pkg
echo 'package main\\nimport "fmt"\\nfunc main() { fmt.Println("Hello, Go!") }' > cmd/main.go`,
    java: `# Java-Projekt mit Maven anlegen
mvn archetype:generate \\
  -DgroupId=com.example \\
  -DartifactId=myproject \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DinteractiveMode=false`,
    csharp: `# C#-Projekt anlegen
dotnet new console -n MyProject
cd MyProject
dotnet add package Newtonsoft.Json`,
    kotlin: `# Kotlin-Projekt mit Gradle anlegen
mkdir myproject && cd myproject
gradle init --type kotlin-application --dsl kotlin`,
    swift: `# Swift-Paket anlegen
mkdir MyPackage && cd MyPackage
swift package init --name MyPackage --type executable`,
    ruby: `# Ruby-Projekt anlegen
mkdir myproject && cd myproject
bundle init
echo "gem 'rspec', group: :development" >> Gemfile
bundle install
mkdir -p lib spec`,
    php: `# PHP-Projekt mit Composer anlegen
mkdir myproject && cd myproject
composer init --no-interaction
mkdir -p src tests
echo '<?php\\ndeclare(strict_types=1);\\necho "Hello, PHP!\\n";' > src/index.php`,
    go: `# Go-Modul anlegen
mkdir myproject && cd myproject
go mod init github.com/user/myproject`,
    dart: `# Dart-Projekt anlegen
dart create myproject && cd myproject`,
    elixir: `# Elixir-Mix-Projekt anlegen
mix new myproject && cd myproject`,
    scala: `# Scala-SBT-Projekt anlegen
mkdir myproject && cd myproject
echo 'scalaVersion := "3.3.1"' > build.sbt
mkdir -p src/main/scala src/test/scala`,
    haskell: `# Haskell-Stack-Projekt anlegen
stack new myproject simple && cd myproject`,
    lua: `# Lua-Projekt anlegen
mkdir myproject && cd myproject
touch main.lua
echo 'print("Hello, Lua!")' > main.lua`,
    r: `# R-Paket anlegen
Rscript -e 'usethis::create_package("mypackage")'`,
    julia: `# Julia-Paket anlegen
julia -e 'using Pkg; Pkg.generate("MyPackage")'`,
    sql: `-- Datenbank-Schema anlegen (PostgreSQL)
CREATE SCHEMA IF NOT EXISTS app;
CREATE TABLE IF NOT EXISTS app.users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON app.users (email);`,
    bash: `# Bash-Skript anlegen
cat > script.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

main() {
  echo "Hello from Bash"
}

main "$@"
EOF
chmod +x script.sh`,
    cpp: `# C++-CMake-Projekt anlegen
mkdir myproject && cd myproject
mkdir -p src include build
cat > CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.20)
project(MyProject CXX)
set(CMAKE_CXX_STANDARD 23)
add_executable(myapp src/main.cpp)
EOF
echo '#include <iostream>\\nint main() { std::cout << "Hello, C++!\\n"; }' > src/main.cpp`,
    c: `# C-CMake-Projekt anlegen
mkdir myproject && cd myproject
cat > CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.20)
project(MyProject C)
set(CMAKE_C_STANDARD 17)
add_executable(myapp main.c)
EOF
echo '#include <stdio.h>\\nint main(void) { printf("Hello, C!\\n"); return 0; }' > main.c`,
  };
  return scripts[slug] ?? `# ${langName}-Projekt anlegen\n# Besuche die offizielle Dokumentation für Setup-Anweisungen.`;
}

export interface GitHubCrawlResult {
  slug: string;
  success: boolean;
  message: string;
  updatedAt: string;
}

/** Main: crawl GitHub for a single language and write the bugfix guide. */
export async function crawlGitHub(slug: string, langName: string): Promise<GitHubCrawlResult> {
  const timestamp = new Date().toISOString();
  const ghLang = GH_LANGUAGE_NAMES[slug] ?? langName;
  logger.info({ slug, ghLang }, "Starting GitHub crawl");

  try {
    // Step 1: top repos
    const repos = await fetchTopRepos(ghLang);
    if (!repos.length) {
      return { slug, success: false, message: `Keine GitHub-Repos für ${langName} gefunden`, updatedAt: timestamp };
    }

    const topRepo = repos[0];
    const sections: string[] = [];

    // Header
    sections.push(
      `# ${langName} — Bug-Fix-Muster & Code-Strukturen\n\n` +
      `> Letzte GitHub-Analyse: ${timestamp}\n\n` +
      `Dieses Dokument wurde automatisch aus öffentlichen GitHub-Repositories generiert.\n` +
      `Es enthält echte Bug-Fix-Commits mit Diffs, typische Projektstrukturen und wiederverwendbare Skripte.`,
    );

    // Step 2: bug-fix commits from top 3 repos
    const bugfixSections: string[] = [];
    let fixCount = 0;

    for (const repo of repos.slice(0, 3)) {
      if (fixCount >= 4) break;
      const commits = await fetchFixCommits(repo.full_name, 10);

      for (const commit of commits.slice(0, 2)) {
        if (fixCount >= 4) break;
        const shortSha = commit.sha.slice(0, 7);
        const msg = commit.commit.message.split("\n")[0].trim();
        const date = commit.commit.author.date.slice(0, 10);

        const diff = await fetchCommitDiff(repo.full_name, commit.sha);
        if (!diff) continue;
        const diffMd = parseDiffToMarkdown(diff);
        if (!diffMd) continue;

        bugfixSections.push(
          `### Fix ${fixCount + 1}: ${msg}\n\n` +
          `**Repository:** [${repo.full_name}](${repo.html_url}) (⭐ ${formatStars(repo.stargazers_count)}) · ` +
          `[Commit \`${shortSha}\`](${commit.html_url}) · **Datum:** ${date}\n\n` +
          `${diffMd}`,
        );
        fixCount++;
      }
    }

    if (bugfixSections.length) {
      sections.push(`## Häufige Bug-Fix-Muster\n\n${bugfixSections.join("\n\n---\n\n")}`);
    }

    // Step 3: project structure from top repo
    const tree = await fetchRepoTree(topRepo.full_name, topRepo.default_branch);
    if (tree) {
      sections.push(
        `## Projekt-Struktur aus der Praxis\n\n` +
        `Aus dem populärsten öffentlichen Repo **[${topRepo.full_name}](${topRepo.html_url})** ` +
        `(⭐ ${formatStars(topRepo.stargazers_count)}):\n\n` +
        (topRepo.description ? `> ${topRepo.description}\n\n` : "") +
        `\`\`\`\n${topRepo.full_name.split("/")[1]}/\n${tree}\n\`\`\``,
      );
    }

    // Step 4: other popular repos list
    if (repos.length > 1) {
      const repoList = repos.map(
        (r) => `- [${r.full_name}](${r.html_url}) — ⭐ ${formatStars(r.stargazers_count)}` +
               (r.description ? ` — ${r.description.slice(0, 80)}` : ""),
      ).join("\n");
      sections.push(`## Populäre Open-Source-Projekte\n\n${repoList}`);
    }

    // Step 5: setup script
    const setupScript = generateSetupScript(slug, langName, topRepo.full_name);
    sections.push(`## Wiederverwendbare Skripte\n\n### Neues Projekt anlegen\n\n\`\`\`bash\n${setupScript}\n\`\`\``);

    // Step 6: common bug-fix patterns (static, per language)
    const staticPatterns = getStaticBugPatterns(slug, langName);
    if (staticPatterns) {
      sections.push(`## Bekannte Fehlermuster & Lösungen\n\n${staticPatterns}`);
    }

    const content = sections.join("\n\n---\n\n");
    writeBugfixGuide(slug, content);
    updateLastGithubCrawled(slug, timestamp);

    logger.info({ slug, fixCount }, "GitHub crawl complete");
    return {
      slug,
      success: true,
      message: `GitHub-Crawl abgeschlossen: ${fixCount} Bug-Fix-Commits, ${repos.length} Repos analysiert`,
      updatedAt: timestamp,
    };
  } catch (err) {
    logger.error({ err, slug }, "GitHub crawl failed");
    return {
      slug,
      success: false,
      message: `Fehler beim GitHub-Crawl: ${(err as Error).message}`,
      updatedAt: timestamp,
    };
  }
}

/** Static, curated bug patterns per language — always included regardless of GitHub availability. */
function getStaticBugPatterns(slug: string, name: string): string {
  const patterns: Record<string, string> = {
    python: `**1. NoneType AttributeError**
\`\`\`diff
- result = get_user().name          # Fehler wenn get_user() None zurückgibt
+ user = get_user()
+ result = user.name if user else "Unknown"
\`\`\`

**2. Mutable Default-Argument**
\`\`\`diff
- def add_item(item, lst=[]):       # lst wird zwischen Aufrufen geteilt!
+ def add_item(item, lst=None):
+     if lst is None: lst = []
    lst.append(item); return lst
\`\`\`

**3. Unbegrenztes Exception-Catching**
\`\`\`diff
- except:                           # Fängt auch KeyboardInterrupt, SystemExit
+ except (ValueError, TypeError) as e:
    logger.error(e)
\`\`\``,

    typescript: `**1. Ungeprüfter Array-Index**
\`\`\`diff
- const first = items[0].id;       // TypeError wenn items leer
+ const first = items[0]?.id ?? null;
\`\`\`

**2. Async ohne await**
\`\`\`diff
- function load() { return fetchData(); }   // gibt Promise zurück, kein Warten
+ async function load() { return await fetchData(); }
\`\`\`

**3. any-Typ als Sicherheitslücke**
\`\`\`diff
- function process(data: any) { return data.value; }
+ function process(data: { value: string }) { return data.value; }
\`\`\``,

    javascript: `**1. Fehlende optionale Verkettung**
\`\`\`diff
- const city = user.address.city;         // TypeError wenn address undefined
+ const city = user?.address?.city ?? "";
\`\`\`

**2. var statt let/const (Hoisting-Bug)**
\`\`\`diff
- for (var i = 0; i < 5; i++) { setTimeout(() => console.log(i), 0); } // gibt 5x "5" aus
+ for (let i = 0; i < 5; i++) { setTimeout(() => console.log(i), 0); } // gibt 0,1,2,3,4 aus
\`\`\``,

    rust: `**1. Borrow nach Move**
\`\`\`diff
- let s = String::from("hi");
- let t = s;          // s ist bewegt
- println!("{}", s);  // Compile-Fehler: s ist nicht mehr gültig
+ let s = String::from("hi");
+ let t = s.clone();  // expliziter Clone
+ println!("{}", s);
\`\`\`

**2. Unwrap auf None/Err**
\`\`\`diff
- let val = map.get("key").unwrap();   // panics wenn key fehlt
+ let val = map.get("key").ok_or("key not found")?;
\`\`\``,

    go: `**1. Nil-Pointer-Dereferenzierung**
\`\`\`diff
- user, _ := findUser(id)
- fmt.Println(user.Name)          // panic wenn user nil
+ user, err := findUser(id)
+ if err != nil || user == nil { return err }
+ fmt.Println(user.Name)
\`\`\`

**2. Fehler ignorieren**
\`\`\`diff
- file, _ := os.Open("data.txt")  // Fehler wird stillschweigend ignoriert
+ file, err := os.Open("data.txt")
+ if err != nil { return fmt.Errorf("open: %w", err) }
\`\`\``,

    java: `**1. NullPointerException**
\`\`\`diff
- String upper = str.toUpperCase(); // NPE wenn str null
+ String upper = Optional.ofNullable(str).map(String::toUpperCase).orElse("");
\`\`\`

**2. String-Vergleich mit ==**
\`\`\`diff
- if (name == "admin") { ... }     // vergleicht Referenzen, nicht Inhalte
+ if ("admin".equals(name)) { ... }
\`\`\``,
  };

  return patterns[slug] ?? `Typische Fehlermuster für **${name}** werden beim nächsten Crawl aus GitHub-Commits extrahiert.`;
}
