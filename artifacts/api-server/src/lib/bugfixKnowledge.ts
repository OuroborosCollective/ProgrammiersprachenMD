import fs from "fs";
import path from "path";
import { logger } from "./logger";
import { listLanguages } from "./knowledgeBase";

const BUGFIX_DIR = path.resolve(__dirname, "../../../knowledge/bugfixes");

/** Ensure the bugfixes directory exists. */
function ensureDir(): void {
  if (!fs.existsSync(BUGFIX_DIR)) {
    fs.mkdirSync(BUGFIX_DIR, { recursive: true });
  }
}

/** Read the bugfix guide markdown for a language. Returns null if not yet generated. */
export function readBugfixGuide(slug: string): string | null {
  ensureDir();
  const filePath = path.join(BUGFIX_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/** Write the bugfix guide markdown for a language. */
export function writeBugfixGuide(slug: string, content: string): void {
  ensureDir();
  const filePath = path.join(BUGFIX_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  logger.info({ slug }, "Bugfix guide written");
}

/** Return true if a bugfix guide exists for the slug. */
export function bugfixGuideExists(slug: string): boolean {
  ensureDir();
  return fs.existsSync(path.join(BUGFIX_DIR, `${slug}.md`));
}

/** Parse the lastUpdated timestamp from the bugfix guide header, if present. */
export function parseLastUpdated(content: string): string | null {
  const match = content.match(/Letzte GitHub-Analyse:\s*([^\n]+)/);
  return match?.[1]?.trim() ?? null;
}

/** Return bugfix guide metadata for all languages that have one. */
export function listBugfixGuides(): Array<{ slug: string; lastUpdated: string | null }> {
  ensureDir();
  const languages = listLanguages();
  return languages
    .filter((l) => bugfixGuideExists(l.slug))
    .map((l) => {
      const content = readBugfixGuide(l.slug) ?? "";
      return { slug: l.slug, lastUpdated: parseLastUpdated(content) };
    });
}
