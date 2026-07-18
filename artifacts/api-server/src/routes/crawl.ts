import { Router, type IRouter } from "express";
import {
  CrawlLanguageParams,
  CrawlLanguageResponse,
  CrawlAllLanguagesResponse,
} from "@workspace/api-zod";
import { getLanguage } from "../lib/knowledgeBase";
import { crawlLanguage, crawlAllLanguages } from "../lib/crawler";
import { crawlGitHub } from "../lib/githubCrawler";

const router: IRouter = Router();

// GitHub crawl — must be registered BEFORE the generic /crawl/:slug route
router.post("/crawl/github/:slug", async (req, res): Promise<void> => {
  const params = CrawlLanguageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lang = getLanguage(params.data.slug);
  if (!lang) {
    res.status(404).json({ error: `Sprache '${params.data.slug}' nicht gefunden` });
    return;
  }

  const result = await crawlGitHub(lang.slug, lang.name);
  const status = result.success ? 200 : 502;
  res.status(status).json(CrawlLanguageResponse.parse(result));
});

// Wikipedia / Linguist crawl for a single language
router.post("/crawl/:slug", async (req, res): Promise<void> => {
  const params = CrawlLanguageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lang = getLanguage(params.data.slug);
  if (!lang) {
    res.status(404).json({ error: `Sprache '${params.data.slug}' nicht gefunden` });
    return;
  }

  const result = await crawlLanguage(lang.slug, lang.name);
  const status = result.success ? 200 : 502;
  res.status(status).json(CrawlLanguageResponse.parse(result));
});

// Wikipedia / Linguist crawl for all languages
router.post("/crawl", async (_req, res): Promise<void> => {
  const results = await crawlAllLanguages();
  res.json(CrawlAllLanguagesResponse.parse(results));
});

export default router;
