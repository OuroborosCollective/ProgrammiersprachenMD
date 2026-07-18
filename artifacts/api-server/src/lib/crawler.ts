import { logger } from "./logger";
import { mergeCrawledData, updateLastCrawled, listLanguages } from "./knowledgeBase";

const WIKIPEDIA_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";
const WIKIPEDIA_SEARCH_URL = "https://en.wikipedia.org/w/api.php";

interface WikipediaSummary {
  title: string;
  description?: string;
  extract: string;
  content_urls?: {
    desktop?: { page?: string };
  };
}

interface WikipediaSearchResult {
  query?: {
    search?: Array<{ title: string; snippet: string }>;
  };
}

/** Map slug to Wikipedia article title if different */
const WIKI_TITLE_OVERRIDES: Record<string, string> = {
  cpp: "C%2B%2B",
  csharp: "C_Sharp_(programming_language)",
  c: "C_(programming_language)",
  r: "R_(programming_language)",
  go: "Go_(programming_language)",
  lua: "Lua_(programming_language)",
  julia: "Julia_(programming_language)",
  sql: "SQL",
  bash: "Bash_(Unix_shell)",
};

function getWikiTitle(slug: string, name: string): string {
  if (WIKI_TITLE_OVERRIDES[slug]) return WIKI_TITLE_OVERRIDES[slug];
  return encodeURIComponent(name + "_(programming_language)");
}

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // We use the global fetch available in Node 18+
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ProgLangKnowledgeBase/1.0 (educational project)",
        "Accept": "application/json",
      },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/** Fetch Wikipedia summary for a language. */
async function fetchWikipediaSummary(
  slug: string,
  name: string,
): Promise<WikipediaSummary | null> {
  const title = getWikiTitle(slug, name);
  const url = `${WIKIPEDIA_SUMMARY_URL}/${title}`;

  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      // Try fallback: search Wikipedia
      const searchUrl = `${WIKIPEDIA_SEARCH_URL}?action=query&list=search&srsearch=${encodeURIComponent(name + " programming language")}&format=json&origin=*&srlimit=1`;
      const searchRes = await fetchWithTimeout(searchUrl);
      if (!searchRes.ok) return null;
      const searchData = (await searchRes.json()) as WikipediaSearchResult;
      const hit = searchData.query?.search?.[0];
      if (!hit) return null;

      const fallbackTitle = encodeURIComponent(hit.title);
      const fallbackRes = await fetchWithTimeout(`${WIKIPEDIA_SUMMARY_URL}/${fallbackTitle}`);
      if (!fallbackRes.ok) return null;
      return (await fallbackRes.json()) as WikipediaSummary;
    }
    return (await res.json()) as WikipediaSummary;
  } catch (err) {
    logger.warn({ err, slug }, "Wikipedia fetch failed");
    return null;
  }
}

/** Fetch latest release information from GitHub Linguist languages.yml */
async function fetchGitHubLinguistInfo(name: string): Promise<string | null> {
  try {
    const url = `https://raw.githubusercontent.com/github-linguist/linguist/master/lib/linguist/languages.yml`;
    const res = await fetchWithTimeout(url, 15000);
    if (!res.ok) return null;
    const text = await res.text();
    // Find the language block in the YAML
    const escapedName = name.replace(/[+#]/g, (c) => `\\${c}`);
    const pattern = new RegExp(
      `^${escapedName}:\\s*\\n([\\s\\S]*?)(?=^\\S|\\Z)`,
      "m",
    );
    const match = text.match(pattern);
    if (!match) return null;
    return `**GitHub Linguist Eintrag für ${name}:**\n\`\`\`yaml\n${name}:\n${match[1].substring(0, 500)}\n\`\`\``;
  } catch {
    return null;
  }
}

export interface CrawlResult {
  slug: string;
  success: boolean;
  message: string;
  updatedAt: string;
}

/** Crawl web sources for a single language and update its markdown file. */
export async function crawlLanguage(
  slug: string,
  name: string,
): Promise<CrawlResult> {
  const timestamp = new Date().toISOString();
  logger.info({ slug }, "Starting crawl");

  try {
    const [wikiData, linguistData] = await Promise.all([
      fetchWikipediaSummary(slug, name),
      fetchGitHubLinguistInfo(name),
    ]);

    if (!wikiData && !linguistData) {
      return {
        slug,
        success: false,
        message: "Keine Daten gefunden (Wikipedia und GitHub Linguist nicht erreichbar)",
        updatedAt: timestamp,
      };
    }

    const sections: string[] = [];

    if (wikiData) {
      sections.push(
        `### Wikipedia-Zusammenfassung\n\n${wikiData.extract}`,
      );
      if (wikiData.content_urls?.desktop?.page) {
        sections.push(`**Quelle:** [Wikipedia](${wikiData.content_urls.desktop.page})`);
      }
    }

    if (linguistData) {
      sections.push(linguistData);
    }

    const crawledContent = sections.join("\n\n");

    // Guard: only write to disk if we actually have non-empty content.
    // An empty write would corrupt the existing entry with a blank section.
    if (!crawledContent.trim()) {
      return {
        slug,
        success: false,
        message: "Keine verwertbaren Inhalte gefunden — Datei wurde nicht verändert",
        updatedAt: timestamp,
      };
    }

    mergeCrawledData(slug, crawledContent);
    updateLastCrawled(slug, timestamp);

    logger.info({ slug }, "Crawl completed successfully");
    return {
      slug,
      success: true,
      message: `Erfolgreich gecrawlt: ${wikiData ? "Wikipedia ✓" : "Wikipedia ✗"}, ${linguistData ? "GitHub Linguist ✓" : "GitHub Linguist ✗"}`,
      updatedAt: timestamp,
    };
  } catch (err) {
    logger.error({ err, slug }, "Crawl failed");
    return {
      slug,
      success: false,
      message: `Fehler beim Crawlen: ${(err as Error).message}`,
      updatedAt: timestamp,
    };
  }
}

/** Crawl all languages sequentially (to avoid rate limiting). */
export async function crawlAllLanguages(): Promise<CrawlResult[]> {
  const languages = listLanguages();
  const results: CrawlResult[] = [];

  for (const lang of languages) {
    const result = await crawlLanguage(lang.slug, lang.name);
    results.push(result);
    // Small delay between requests to be polite to Wikipedia
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}
