import fs from "fs";
import path from "path";
import { logger } from "./logger";

// Resolve the knowledge directory relative to the dist output folder.
// dist/ -> api-server/ -> artifacts/ -> workspace/ -> knowledge/languages
const KNOWLEDGE_DIR = path.resolve(
  __dirname,
  "../../../knowledge/languages",
);
const INDEX_FILE = path.resolve(__dirname, "../../../knowledge/index.json");

export interface LanguageMeta {
  slug: string;
  name: string;
  year: number | null;
  paradigms: string[];
  description: string;
  tags: string[];
  lastCrawled: string | null;
}

export interface LanguageDetail extends LanguageMeta {
  content: string;
}

/** Load the index JSON (all language metadata). */
function loadIndex(): LanguageMeta[] {
  try {
    const raw = fs.readFileSync(INDEX_FILE, "utf-8");
    return JSON.parse(raw) as LanguageMeta[];
  } catch (err) {
    logger.error({ err }, "Failed to load knowledge index");
    return [];
  }
}

/** Persist the index back to disk. */
function saveIndex(index: LanguageMeta[]): void {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + "\n", "utf-8");
}

/** Read the markdown content of a single language file. */
function readMarkdown(slug: string): string | null {
  const filePath = path.join(KNOWLEDGE_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/** Write the markdown content for a language file. */
export function writeMarkdown(slug: string, content: string): void {
  const filePath = path.join(KNOWLEDGE_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
}

/** Return all languages as summaries (no content). */
export function listLanguages(): LanguageMeta[] {
  return loadIndex();
}

/** Return a single language with its full markdown content. */
export function getLanguage(slug: string): LanguageDetail | null {
  const index = loadIndex();
  const meta = index.find((l) => l.slug === slug);
  if (!meta) return null;

  const content = readMarkdown(slug) ?? "_Kein Inhalt vorhanden._";
  return { ...meta, content };
}

/** Simple full-text search across name, description, tags, paradigms, and content. */
export function searchLanguages(query: string): LanguageMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const index = loadIndex();
  return index.filter((lang) => {
    const haystack = [
      lang.name,
      lang.description,
      ...lang.tags,
      ...lang.paradigms,
    ]
      .join(" ")
      .toLowerCase();

    // Also search content file
    const content = readMarkdown(lang.slug)?.toLowerCase() ?? "";
    return haystack.includes(q) || content.includes(q);
  });
}

/** Update the lastCrawled timestamp for a language in the index. */
export function updateLastCrawled(slug: string, timestamp: string): void {
  const index = loadIndex();
  const entry = index.find((l) => l.slug === slug);
  if (entry) {
    entry.lastCrawled = timestamp;
    saveIndex(index);
  }
}

/** Update or merge crawled data into a language entry. */
export function mergeCrawledData(
  slug: string,
  newContent: string,
): void {
  const currentContent = readMarkdown(slug) ?? "";
  // Append a "Letzte Web-Daten" section with the crawled content
  const timestamp = new Date().toISOString();
  const crawledSection = `\n\n---\n\n## Letzte Web-Daten (Crawler)\n\n> Zuletzt aktualisiert: ${timestamp}\n\n${newContent}`;

  // Replace any existing crawled section, or append
  const existingPattern = /\n\n---\n\n## Letzte Web-Daten[\s\S]*$/;
  const updatedContent = existingPattern.test(currentContent)
    ? currentContent.replace(existingPattern, crawledSection)
    : currentContent + crawledSection;

  writeMarkdown(slug, updatedContent);
}
