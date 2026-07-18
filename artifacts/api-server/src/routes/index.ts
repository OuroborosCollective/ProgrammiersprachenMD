import { Router, type IRouter } from "express";
import healthRouter from "./health";
import languagesRouter from "./languages";
import crawlRouter from "./crawl";

const router: IRouter = Router();

router.use(healthRouter);
router.use(languagesRouter);
router.use(crawlRouter);

export default router;
