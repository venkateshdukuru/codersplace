import express, { RequestHandler } from "express";
import {
  createHackathon,
  getHackathons,
  updateHackathon,
  deleteHackathon,
  getHackathonsPublic,
} from "../controllers/hackathonController";
import { protect, superadminOnly } from "../middleware/authMiddleware";
import { hackathonValidation } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  superadminOnly,
  hackathonValidation,
  createHackathon as RequestHandler
);

router.put(
  "/:hackathonId",
  protect,
  superadminOnly,
  hackathonValidation,
  updateHackathon as RequestHandler
);

router.delete(
  "/:hackathonId",
  protect,
  superadminOnly,
  deleteHackathon as RequestHandler
);

// router.get("/", protect, getHackathons as RequestHandler);

router.get("/", getHackathonsPublic as RequestHandler); // for only for pulbic 

export default router;