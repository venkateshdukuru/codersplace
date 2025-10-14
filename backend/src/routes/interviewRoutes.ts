import express, { RequestHandler } from "express";
import {
  createInterview,
  updateInterview,
  deleteInterview,
  getInterviews,
  submitInterview,
  getInterviewsPublic,
} from "../controllers/interviewControllers";
import { protect, superadminOnly } from "../middleware/authMiddleware";
import { interviewValidation } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  superadminOnly,
  interviewValidation,
  createInterview as RequestHandler
);

router.put(
  "/:interviewId",
  protect,
  superadminOnly,
  interviewValidation,
  updateInterview as RequestHandler
);

router.delete(
  "/:interviewId",
  protect,
  superadminOnly,
  deleteInterview as RequestHandler
);

// router.get("/", protect, getInterviews as RequestHandler);
router.get("/", getInterviews as RequestHandler);



// NEW: Public endpoint for getting interviews - no authentication required
router.get("/public", getInterviewsPublic as RequestHandler);

router.post(
  "/:interviewId/submit",
  protect,
  submitInterview as RequestHandler
);

export default router;