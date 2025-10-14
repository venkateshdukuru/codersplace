import express, { RequestHandler } from "express";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzes,
  submitQuiz,
} from "../controllers/quizController";
import { protect, superadminOnly } from "../middleware/authMiddleware";
import { quizValidation } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  superadminOnly,
  quizValidation,
  createQuiz as RequestHandler
);

router.put(
  "/:quizId",
  protect,
  superadminOnly,
  quizValidation,
  updateQuiz as RequestHandler
);

router.delete(
  "/:quizId",
  protect,
  superadminOnly,
  deleteQuiz as RequestHandler
);

router.get("/", protect, getQuizzes as RequestHandler);

router.post(
  "/:quizId/submit",
  protect,
  submitQuiz as RequestHandler
);

export default router;