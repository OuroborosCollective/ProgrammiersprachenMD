import { Router, type IRouter } from "express";
import {
  CrawlLanguageParams,
  CrawlLanguageResponse,
  CrawlAllLanguagesResponse,
} from "@workspace/api-zod";
import { getLanguage } from "../lib/knowledgeBase";
import { crawlLanguage, crawlAllLanguages } from "../lib/crawler";

const router: IRouter = Router();

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

router.post("/crawl", async (_req, res): Promise<void> => {
  const results = await crawlAllLanguages();
  res.json(CrawlAllLanguagesResponse.parse(results));
});

export default router;
