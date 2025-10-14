import express, { RequestHandler } from "express";
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblems,
  submitProblem,
} from "../controllers/problemController";
import { protect, superadminOnly } from "../middleware/authMiddleware";
import { problemValidation } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  superadminOnly,
  problemValidation,
  createProblem as RequestHandler
);

router.put(
  "/:problemId",
  protect,
  superadminOnly,
  problemValidation,
  updateProblem as RequestHandler
);

router.delete(
  "/:problemId",
  protect,
  superadminOnly,
  deleteProblem as RequestHandler
);

router.get("/", protect, getProblems as RequestHandler);

router.post(
  "/:problemId/submit",
  protect,
  submitProblem as RequestHandler
);

export default router;