import express from "express";
import multer from "multer";
import {
  uploadAvatar,
  deleteAvatar,
  getImageKitAuth,
} from "../controllers/avatarController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("avatar"), uploadAvatar);
router.delete("/delete", protect, deleteAvatar);
router.get("/auth", protect, getImageKitAuth);

export default router;