import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import ranksRouter from "./ranks";
import newsRouter from "./news";
import shopRouter from "./shop";
import paymentsRouter from "./payments";
import settingsRouter from "./settings";
import teamRouter from "./team";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/ranks", ranksRouter);
router.use("/news", newsRouter);
router.use("/shop", shopRouter);
router.use("/payments", paymentsRouter);
router.use("/settings", settingsRouter);
router.use("/team", teamRouter);
router.use("/admin", adminRouter);

export default router;
