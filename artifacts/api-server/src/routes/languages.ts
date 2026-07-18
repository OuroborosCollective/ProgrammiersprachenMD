import { Router, type IRouter } from "express";
import {
  ListLanguagesResponse,
  GetLanguageParams,
  GetLanguageResponse,
  SearchLanguagesQueryParams,
  SearchLanguagesResponse,
} from "@workspace/api-zod";
import { listLanguages, getLanguage, searchLanguages } from "../lib/knowledgeBase";

const router: IRouter = Router();

router.get("/languages", async (_req, res): Promise<void> => {
  const languages = listLanguages();
  res.json(ListLanguagesResponse.parse(languages));
});

router.get("/languages/:slug", async (req, res): Promise<void> => {
  const params = GetLanguageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const language = getLanguage(params.data.slug);
  if (!language) {
    res.status(404).json({ error: `Sprache '${params.data.slug}' nicht gefunden` });
    return;
  }

  res.json(GetLanguageResponse.parse(language));
});

router.get("/search", async (req, res): Promise<void> => {
  const queryParams = SearchLanguagesQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }

  const results = searchLanguages(queryParams.data.q);
  res.json(SearchLanguagesResponse.parse(results));
});

export default router;
