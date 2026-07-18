import { Router, type IRouter } from "express";
import healthRouter from "./health";
import languagesRouter from "./languages";
import crawlRouter from "./crawl";
import bugfixesRouter from "./bugfixes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(languagesRouter);
router.use(crawlRouter);
router.use(bugfixesRouter);

export default router;
