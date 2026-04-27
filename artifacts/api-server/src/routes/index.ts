import { Router, type IRouter } from "express";
import healthRouter from "./health";
import nodesRouter from "./nodes";
import telemetryRouter from "./telemetry";
import complianceRouter from "./compliance";
import cbomRouter from "./cbom";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(nodesRouter);
router.use(telemetryRouter);
router.use(complianceRouter);
router.use(cbomRouter);
router.use(alertsRouter);
router.use(dashboardRouter);

export default router;
