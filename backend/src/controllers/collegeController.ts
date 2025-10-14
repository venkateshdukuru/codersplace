import { ObjectId } from "mongodb";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import { CollegeModel, getUserModel, HackathonModel, ProblemModel, QuizModel, WeeklyTestModel, InterviewModel } from "../models";
import {
  ApiResponse,
  College,
  CollegeCreationPayload,
  UserRole,
  AuthRequestHandler,
} from "../types";
import asyncHandler from "../utils/requestHandler";
import mongoose from 'mongoose';

export const createCollege: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in createCollege, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to create college, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const payload = req.body as CollegeCreationPayload;
    const college = new CollegeModel({
      ...payload,
      createdAt: new Date(),
      completedTasks: { problems: 0, quizzes: 0, weeklyTests: 0, hackathons: 0, interviews: 0 }
    });

    await college.save();

    res.status(201).json({
      success: true,
      data: {
        _id: college._id.toString(),
        name: college.name,
        createdAt: college.createdAt,
        updatedAt: college.updatedAt,
        completedTasks: college.completedTasks,
      },
      message: "College created successfully",
    } as unknown as ApiResponse<College>);
  }
);

export const updateCollege: AuthRequestHandler<{ collegeId: string }> =
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in updateCollege, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to update college, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { collegeId } = req.params;
    const payload = req.body as Partial<CollegeCreationPayload>;

    const college = await CollegeModel.findByIdAndUpdate(
      new ObjectId(collegeId),
      { ...payload, updatedAt: new Date() },
      { new: true }
    );

    if (!college) {
      logger.warn(`College not found, ID=${collegeId}, IP=${req.ip}`);
      return next(createError(404, "College not found"));
    }

    res.status(200).json({
      success: true,
      data: {
        _id: college._id.toString(),
        name: college.name,
        createdAt: college.createdAt,
        updatedAt: college.updatedAt,
        completedTasks: college.completedTasks,
      },
      message: "College updated successfully",
    } as unknown as ApiResponse<College>);
  });

export const deleteCollege: AuthRequestHandler<{ collegeId: string }> =
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in deleteCollege, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to delete college, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { collegeId } = req.params;

    const college = await CollegeModel.findByIdAndDelete(new ObjectId(collegeId));
    if (!college) {
      logger.warn(`College not found, ID=${collegeId}, IP=${req.ip}`);
      return next(createError(404, "College not found"));
    }

    const sanitizedName = college.name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_/, '')
      .replace(/_$/, '');
    const collectionName = `Users_${sanitizedName}`;
    await mongoose.connection.dropCollection(collectionName).catch((err) => {
      if (err.code !== 26) {
        logger.error(`Failed to drop collection ${collectionName}: ${err}, IP=${req.ip}`);
      }
    });

    // No delete for global tasks, as they are shared

    res.status(200).json({
      success: true,
      message: "College and associated data deleted successfully",
    } as ApiResponse<void>);
  });

export const getAllCollegesData: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in getAllCollegesData, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to get all colleges data, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const colleges = await CollegeModel.find().lean();
    const hackathonCount = await HackathonModel.countDocuments(); // Global
    const problemCount = await ProblemModel.countDocuments(); // Global
    const quizCount = await QuizModel.countDocuments(); // Global
    const weeklyTestCount = await WeeklyTestModel.countDocuments(); // Global
    const interviewCount = await InterviewModel.countDocuments(); // Global

    const data = await Promise.all(
      colleges.map(async (college) => {
        const UserModel = getUserModel(college.name);
        const studentCount = await UserModel.countDocuments({
          collegeId: college._id,
          role: UserRole.STUDENT,
        });
        const facultyCount = await UserModel.countDocuments({
          collegeId: college._id,
          role: UserRole.FACULTY,
        });

        // Add branch-wise stats
        const branches = await UserModel.aggregate([
          { $match: { collegeId: college._id, role: UserRole.STUDENT } },
          { $group: { _id: "$branch", count: { $sum: 1 } } },
        ]);

        return {
          college: {
            _id: college._id.toString(),
            name: college.name,
            createdAt: college.createdAt,
            updatedAt: college.updatedAt,
            completedTasks: college.completedTasks,
          },
          stats: {
            studentCount,
            facultyCount,
            hackathonCount, // Now global, same for all
            problemCount, // Now global
            quizCount, // Now global
            weeklyTestCount, // Now global
            interviewCount, // Now global
            branches,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      data,
      message: "All colleges data retrieved successfully",
    } as ApiResponse<any>);
  }
);

export const searchColleges: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in searchColleges, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to search colleges, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { name } = req.query as { name?: string };

    if (!name) {
      return next(createError(400, "Search term is required"));
    }

    const colleges = await CollegeModel.find({
      name: { $regex: name, $options: 'i' },
    }).lean();

    res.status(200).json({
      success: true,
      data: colleges.map(college => ({
        _id: college._id.toString(),
        name: college.name,
        createdAt: college.createdAt,
        updatedAt: college.updatedAt,
        completedTasks: college.completedTasks,
      })),
      message: "Colleges retrieved successfully",
    } as unknown as ApiResponse<College[]>);
  });

export const getCollegeByName: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in getCollegeByName, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to get college by name, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { name } = req.query as { name?: string };

    if (!name) {
      return next(createError(400, "College name is required"));
    }

    const college = await CollegeModel.findOne({ name }).lean();

    if (!college) {
      logger.warn(`College not found, Name=${name}, IP=${req.ip}`);
      return next(createError(404, "College not found"));
    }

    const UserModel = getUserModel(college.name);
    const students = await UserModel.find({ role: UserRole.STUDENT, collegeId: college._id.toString() }).lean();
    const faculty = await UserModel.find({ role: UserRole.FACULTY, collegeId: college._id.toString() }).lean();

    const serializedStudents = await Promise.all(
      students.map(async (student) => ({
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        branch: student.branch,
        rollNumber: student.rollNumber,
        completedProblems: await ProblemModel.countDocuments({ completedBy: student._id }),
        completedQuizzes: await QuizModel.countDocuments({ completedBy: student._id }),
        completedInterviews: await InterviewModel.countDocuments({ completedBy: student._id }),
        completedWeeklyTests: await WeeklyTestModel.countDocuments({ completedBy: student._id }),
        completedHackathons: await HackathonModel.countDocuments({ completedBy: student._id }),
      }))
    );

    const serializedFaculty = faculty.map((fac) => ({
      _id: fac._id.toString(),
      name: fac.name,
      email: fac.email,
    }));

    res.status(200).json({
      success: true,
      data: {
        college: {
          _id: college._id.toString(),
          name: college.name,
          createdAt: college.createdAt,
          updatedAt: college.updatedAt,
          completedTasks: college.completedTasks,
        },
        students: serializedStudents,
        faculty: serializedFaculty,
      },
      message: "College data retrieved successfully",
    } as ApiResponse<any>);
  }
);

export const getCollegeStudents: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in getCollegeStudents, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN && req.user.role !== UserRole.FACULTY) {
      logger.warn(
        `Unauthorized attempt to get college students, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { collegeName, branch } = req.query as { collegeName?: string; branch?: string };

    if (!collegeName) {
      return next(createError(400, "College name is required"));
    }

    const college = await CollegeModel.findOne({ name: collegeName });
    if (!college) {
      return next(createError(404, "College not found"));
    }

    const UserModel = getUserModel(collegeName);
    const query: any = { role: UserRole.STUDENT, collegeId: college._id };
    if (branch) {
      query.branch = branch;
    }

    const students = await UserModel.find(query).lean();

    res.status(200).json({
      success: true,
      data: { students },
      message: "Students retrieved successfully",
    });
  }
);

export const getCollegeFaculty: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      logger.warn(`No user data in getCollegeFaculty, IP=${req.ip}`);
      return next(createError(401, 'Not authenticated'));
    }

    if (req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to get college faculty, IP=${req.ip}, User=${req.user._id?.toString() || "unknown"}`
      );
      return next(createError(403, "Not authorized"));
    }

    const { collegeName } = req.query as { collegeName?: string };

    if (!collegeName) {
      return next(createError(400, "College name is required"));
    }

    const college = await CollegeModel.findOne({ name: collegeName });
    if (!college) {
      return next(createError(404, "College not found"));
    }

    const UserModel = getUserModel(collegeName);
    const faculty = await UserModel.find({ role: UserRole.FACULTY, collegeId: college._id }).lean();

    res.status(200).json({
      success: true,
      data: faculty.map(fac => ({
        _id: fac._id.toString(),
        name: fac.name,
        email: fac.email,
      })),
      message: "Faculty retrieved successfully",
    });
  }
);