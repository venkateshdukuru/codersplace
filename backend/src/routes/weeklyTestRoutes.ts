// backend/src/routes/weeklyTestRoutes.ts

import express, { RequestHandler } from "express";
import {
  createPublicWeeklyTest,
  createCollegeWeeklyTest,
  updateWeeklyTest,
  deleteWeeklyTest,
  getWeeklyTests,
  submitWeeklyTest,
} from "../controllers/weeklyTestController";
import { protect, superadminOnly, facultyOrSuperadmin } from "../middleware/authMiddleware";
import {
  publicWeeklyTestValidation,
  collegeWeeklyTestValidation,
} from "../middleware/validationMiddleware";

const router = express.Router();

// PUBLIC WEEKLY TEST ROUTES
router.post(
  "/public",
  protect,
  superadminOnly,
  publicWeeklyTestValidation,
  createPublicWeeklyTest as RequestHandler
);

// COLLEGE-SPECIFIC WEEKLY TEST ROUTES
router.post(
  "/college",
  protect,
  facultyOrSuperadmin,
  collegeWeeklyTestValidation,
  createCollegeWeeklyTest as RequestHandler
);

// UPDATE & DELETE
router.put(
  "/:testId",
  protect,
  superadminOnly,
  updateWeeklyTest as RequestHandler
);

router.delete(
  "/:testId",
  protect,
  superadminOnly,
  deleteWeeklyTest as RequestHandler
);

// GET ALL WEEKLY TESTS
router.get("/", protect, getWeeklyTests as RequestHandler);

// SUBMIT WEEKLY TEST
router.post(
  "/:testId/submit",
  protect,
  submitWeeklyTest as RequestHandler
);

export default router;