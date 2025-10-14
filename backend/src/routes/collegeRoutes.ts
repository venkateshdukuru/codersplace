import express, { RequestHandler } from "express";
import {
  createCollege,
  updateCollege,
  deleteCollege,
  getAllCollegesData,
  searchColleges,
  getCollegeByName,
  getCollegeStudents,
  getCollegeFaculty,
} from "../controllers/collegeController";
import { collegeValidation } from "../middleware/validationMiddleware";
import { protect, superadminOnly, facultyOrSuperadmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, superadminOnly, collegeValidation, createCollege as RequestHandler);

router.put("/:collegeId", protect, superadminOnly, collegeValidation, updateCollege as RequestHandler);

router.delete("/:collegeId", protect, superadminOnly, deleteCollege as RequestHandler);

router.get("/data", protect, superadminOnly, getAllCollegesData as RequestHandler);

router.get("/search", protect, superadminOnly, searchColleges as RequestHandler);

router.get("/by-name", protect, superadminOnly, getCollegeByName as RequestHandler);

router.get("/students", protect, facultyOrSuperadmin, getCollegeStudents as RequestHandler);

router.get("/faculty", protect, superadminOnly, getCollegeFaculty as RequestHandler);

export default router;