// backend/src/routes/quizRoutes.ts

import express, { RequestHandler } from "express";
import {
  createPublicQuiz,
  createCollegeQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzes,
  submitQuiz,
} from "../controllers/quizController";
import { protect, superadminOnly, facultyOrSuperadmin } from "../middleware/authMiddleware";
import {
  publicQuizValidation,
  collegeQuizValidation,
} from "../middleware/validationMiddleware";

const router = express.Router();

// PUBLIC QUIZ ROUTES
router.post(
  "/public",
  protect,
  superadminOnly,
  publicQuizValidation,
  createPublicQuiz as RequestHandler
);

// COLLEGE-SPECIFIC QUIZ ROUTES
router.post(
  "/college",
  protect,
  facultyOrSuperadmin,
  collegeQuizValidation,
  createCollegeQuiz as RequestHandler
);

// UPDATE & DELETE
router.put(
  "/:quizId",
  protect,
  superadminOnly,
  updateQuiz as RequestHandler
);

router.delete(
  "/:quizId",
  protect,
  superadminOnly,
  deleteQuiz as RequestHandler
);

// GET ALL QUIZZES
router.get("/", protect, getQuizzes as RequestHandler);

// SUBMIT QUIZ
router.post(
  "/:quizId/submit",
  protect,
  submitQuiz as RequestHandler
);

export default router;