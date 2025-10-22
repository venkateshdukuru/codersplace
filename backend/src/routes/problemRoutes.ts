// backend/src/routes/problemRoutes.ts

import express, { RequestHandler } from "express";
import {
  createProblem,
  createPublicProblem,
  createCollegeProblem,
  updateProblem,
  deleteProblem,
  getProblems,
  submitProblem,
} from "../controllers/problemController";
import { protect, superadminOnly, facultyOrSuperadmin } from "../middleware/authMiddleware";
import {
  publicProblemValidation,
  collegeProblemValidation,
} from "../middleware/validationMiddleware";

const router = express.Router();

// PUBLIC PROBLEM ROUTES (No collegeId required)
router.post(
  "/public",
  protect,
  superadminOnly,
  publicProblemValidation,
  createPublicProblem as RequestHandler
);

// COLLEGE-SPECIFIC PROBLEM ROUTES (collegeId required)
router.post(
  "/college",
  protect,
  facultyOrSuperadmin, // Faculty can also create for their college
  collegeProblemValidation,
  createCollegeProblem as RequestHandler
);

// UPDATE & DELETE (works for both public and college-specific)
router.put(
  "/:problemId",
  protect,
  superadminOnly,
  updateProblem as RequestHandler
);

router.delete(
  "/:problemId",
  protect,
  superadminOnly,
  deleteProblem as RequestHandler
);

// GET ALL PROBLEMS (Returns college-specific first, then public)
router.get("/", protect, getProblems as RequestHandler);

// SUBMIT PROBLEM
router.post(
  "/:problemId/submit",
  protect,
  submitProblem as RequestHandler
);

export default router;