import { Router } from "express";
import {
  migrateUser,
  manageCollegeFaculty,
  getStudentStats,
  getStudentByRollNumber,
  getAllStudentStats,
  searchStudents,
  getMyStats,
  getProfile,
  updateProfile,
} from "../controllers/userController"; // Corrected import path
import { protect } from "../middleware/authMiddleware"; // Changed 'authenticate' to 'protect'
import { migrationValidation, facultyManagementValidation } from "../middleware/validationMiddleware";

const router = Router();

router.post("/migrate", protect, migrationValidation, migrateUser);
router.post("/faculty", protect, facultyManagementValidation, manageCollegeFaculty);
router.get("/stats", protect, getStudentStats);
router.get("/student", protect, getStudentByRollNumber);
router.get("/all-stats", protect, getAllStudentStats);
router.get("/search", protect, searchStudents);
router.get("/my-stats", protect, getMyStats);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;