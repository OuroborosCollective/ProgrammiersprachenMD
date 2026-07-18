import { Router, type IRouter } from "express";
import { GetLanguageParams } from "@workspace/api-zod";
import { readBugfixGuide, parseLastUpdated } from "../lib/bugfixKnowledge";
import { getLanguage } from "../lib/knowledgeBase";

const router: IRouter = Router();

router.get("/bugfixes/:slug", async (req, res): Promise<void> => {
  const params = GetLanguageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lang = getLanguage(params.data.slug);
  if (!lang) {
    res.status(404).json({ error: `Sprache '${params.data.slug}' nicht gefunden` });
    return;
  }

  const content = readBugfixGuide(params.data.slug);
  if (!content) {
    res.status(404).json({
      error: `Noch kein Bug-Fix-Guide für '${lang.name}' vorhanden. Starte den GitHub-Crawler mit POST /api/crawl/github/${params.data.slug}`,
    });
    return;
  }

  res.json({
    slug: lang.slug,
    name: lang.name,
    content,
    lastUpdated: parseLastUpdated(content),
  });
});

export default router;
