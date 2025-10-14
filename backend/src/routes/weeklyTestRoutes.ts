import express, { RequestHandler } from "express";
import {
  createWeeklyTest,
  updateWeeklyTest,
  deleteWeeklyTest,
  getWeeklyTests,
  submitWeeklyTest,
} from "../controllers/weeklyTestController";
import { protect, superadminOnly } from "../middleware/authMiddleware";
import { weeklyTestValidation } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  superadminOnly,
  weeklyTestValidation,
  createWeeklyTest as RequestHandler
);

router.put(
  "/:testId",
  protect,
  superadminOnly,
  weeklyTestValidation,
  updateWeeklyTest as RequestHandler
);

router.delete(
  "/:testId",
  protect,
  superadminOnly,
  deleteWeeklyTest as RequestHandler
);

router.get("/", protect, getWeeklyTests as RequestHandler);

router.post(
  "/:testId/submit",
  protect,
  submitWeeklyTest as RequestHandler
);

export default router;