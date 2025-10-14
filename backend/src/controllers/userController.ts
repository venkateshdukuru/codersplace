import { ObjectId } from "mongodb";
import { RequestHandler, Response, NextFunction } from "express";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import { CollegeModel, getUserModel, ProblemModel, QuizModel, WeeklyTestModel, HackathonModel, InterviewModel } from "../models";
import {
  FacultyManagementPayload,
  ApiResponse,
  MigrationRequestPayload,
  User,
  UserRole,
  StudentStats,
  AuthRequest,
} from "../types";
import asyncHandler from "../utils/requestHandler";

export const migrateUser: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in migrateUser, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (authReq.user.role !== UserRole.SUPERADMIN) {
    logger.warn(
      `Unauthorized attempt to migrate user, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { userId, collegeName } = req.body as MigrationRequestPayload & { collegeName: string };

  const UserModel = getUserModel(collegeName);
  const user = await UserModel.findById(new ObjectId(userId));
  if (!user) {
    logger.warn(`User not found for migration, ID=${userId}, College=${collegeName}, IP=${req.ip}`);
    return next(createError(404, "User not found"));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    new ObjectId(userId),
    { migrationStatus: "completed", updatedAt: new Date() },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser!._id.toString(),
      name: updatedUser!.name,
      email: updatedUser!.email,
      branch: updatedUser!.branch,
      rollNumber: updatedUser!.rollNumber,
      role: updatedUser!.role,
      collegeId: updatedUser!.collegeId?.toString(),
      collegeName: updatedUser!.collegeName,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
      lastLogin: updatedUser!.lastLogin,
      migrationStatus: updatedUser!.migrationStatus,
    },
    message: "User migrated successfully",
  } as unknown as ApiResponse<User>);
});

export const manageCollegeFaculty: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in manageCollegeFaculty, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (!authReq.user.collegeId || ![UserRole.FACULTY, UserRole.SUPERADMIN].includes(authReq.user.role)) {
    logger.warn(
      `Unauthorized attempt to manage college faculty, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { collegeId, userId, action } = req.body as FacultyManagementPayload;

  const college = await CollegeModel.findById(new ObjectId(collegeId));
  if (!college) {
    logger.warn(`College not found, ID=${collegeId}, IP=${req.ip}`);
    return next(createError(404, "College not found"));
  }

  const UserModel = getUserModel(college.name);
  if (action === "add") {
    const user = await UserModel.findById(new ObjectId(userId));
    if (!user) {
      logger.warn(`User not found, ID=${userId}, IP=${req.ip}`);
      return next(createError(404, "User not found"));
    }
    user.collegeId = new ObjectId(collegeId);
    user.collegeName = college.name;
    user.role = UserRole.FACULTY;
    await user.save();
  } else if (action === "remove") {
    await UserModel.findByIdAndUpdate(new ObjectId(userId), {
      collegeId: null,
      collegeName: null,
      role: UserRole.STUDENT,
      updatedAt: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    message: `Faculty ${action}ed successfully`,
  } as ApiResponse<void>);
});

export const getStudentStats: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in getStudentStats, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (!authReq.user.collegeId || ![UserRole.FACULTY, UserRole.SUPERADMIN].includes(authReq.user.role)) {
    logger.warn(
      `Unauthorized attempt to get student stats, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { rollNumber, branch } = req.query as { rollNumber?: string; branch?: string };

  const college = await CollegeModel.findById(authReq.user.collegeId);
  if (!college) {
    logger.warn(`College not found, ID=${authReq.user.collegeId?.toString()}, IP=${req.ip}`);
    return next(createError(404, "College not found"));
  }

  const UserModel = getUserModel(college.name);
  const query: any = { collegeId: authReq.user.collegeId, role: UserRole.STUDENT };
  if (rollNumber) query.rollNumber = { $regex: rollNumber, $options: 'i' };
  if (branch) query.branch = { $regex: branch, $options: 'i' };
  const students = await UserModel.find(query).lean();

  const totalProblems = await ProblemModel.countDocuments({});
  const totalQuizzes = await QuizModel.countDocuments({});
  const totalWeeklyTests = await WeeklyTestModel.countDocuments({});
  const totalHackathons = await HackathonModel.countDocuments({});
  const totalInterviews = await InterviewModel.countDocuments({});

  const stats: StudentStats[] = await Promise.all(
    students.map(async (student) => {
      const collegeIdStr = student.collegeId?.toString() ?? "";
      const completedProblems = await ProblemModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedQuizzes = await QuizModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedInterviews = await InterviewModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const testScores = await WeeklyTestModel.aggregate([
        { $match: { "scores.userId": student._id } },
        { $unwind: "$scores" },
        { $match: { "scores.userId": student._id } },
        { $group: { _id: null, totalScore: { $sum: "$scores.score" } } },
      ]);

      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        collegeId: student.collegeId,
        collegeName: student.collegeName,
        completedProblems,
        completedQuizzes,
        completedInterviews,
        totalTestScore: testScores[0]?.totalScore || 0,
        totalProblems,
        totalQuizzes,
        totalWeeklyTests,
        totalHackathons,
        totalInterviews,
        notCompletedProblems: totalProblems - completedProblems,
        notCompletedQuizzes: totalQuizzes - completedQuizzes,
        notCompletedInterviews: totalInterviews - completedInterviews,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: stats,
    message: "Student stats retrieved successfully",
  } as ApiResponse<StudentStats[]>);
});

export const getStudentByRollNumber: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in getStudentByRollNumber, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (![UserRole.FACULTY, UserRole.SUPERADMIN].includes(authReq.user.role)) {
    logger.warn(
      `Unauthorized attempt to get student by roll number, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { rollNumber, collegeName } = req.query as { rollNumber: string; collegeName?: string };

  if (!rollNumber) {
    return next(createError(400, "Roll number is required"));
  }

  let colleges;
  if (authReq.user.role === UserRole.FACULTY) {
    if (!authReq.user.collegeId) {
      return next(createError(400, "Faculty is not associated with any college"));
    }
    colleges = await CollegeModel.find({ _id: authReq.user.collegeId }).lean();
  } else {
    colleges = collegeName
      ? await CollegeModel.find({ name: { $regex: collegeName, $options: "i" } }).lean()
      : await CollegeModel.find().lean();
  }

  let student: any = null;
  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    student = await UserModel.findOne({ rollNumber, role: UserRole.STUDENT }).lean();
    if (student) break;
  }

  if (!student) {
    logger.warn(`Student not found, RollNumber=${rollNumber}, IP=${req.ip}`);
    return next(createError(404, "Student not found"));
  }

  const collegeIdStr = student.collegeId?.toString() ?? "";
  const completedProblems = await ProblemModel.countDocuments({
    completedBy: { $in: [student._id] },
  });
  const completedQuizzes = await QuizModel.countDocuments({
    completedBy: { $in: [student._id] },
  });
  const completedInterviews = await InterviewModel.countDocuments({
    completedBy: { $in: [student._id] },
  });
  const testScores = await WeeklyTestModel.aggregate([
    { $match: { "scores.userId": student._id } },
    { $unwind: "$scores" },
    { $match: { "scores.userId": student._id } },
    { $group: { _id: null, totalScore: { $sum: "$scores.score" } } },
  ]);

  const totalProblems = await ProblemModel.countDocuments({});
  const totalQuizzes = await QuizModel.countDocuments({});
  const totalWeeklyTests = await WeeklyTestModel.countDocuments({});
  const totalHackathons = await HackathonModel.countDocuments({});
  const totalInterviews = await InterviewModel.countDocuments({});

  const stats: StudentStats = {
    studentId: student._id,
    name: student.name,
    email: student.email,
    collegeId: student.collegeId,
    collegeName: student.collegeName,
    completedProblems,
    completedQuizzes,
    completedInterviews,
    totalTestScore: testScores[0]?.totalScore || 0,
    totalProblems,
    totalQuizzes,
    totalWeeklyTests,
    totalHackathons,
    totalInterviews,
    notCompletedProblems: totalProblems - completedProblems,
    notCompletedQuizzes: totalQuizzes - completedQuizzes,
    notCompletedInterviews: totalInterviews - completedInterviews,
  };

  res.status(200).json({
    success: true,
    data: stats,
    message: "Student stats retrieved successfully",
  } as ApiResponse<StudentStats>);
});

export const getAllStudentStats: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in getAllStudentStats, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (authReq.user.role !== UserRole.SUPERADMIN) {
    logger.warn(
      `Unauthorized attempt to get all student stats, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { rollNumber, branch, collegeName } = req.query as { rollNumber?: string; branch?: string; collegeName?: string };

  const colleges = collegeName
    ? await CollegeModel.find({ name: { $regex: collegeName, $options: "i" } }).lean()
    : await CollegeModel.find().lean();
  const stats: StudentStats[] = [];

  const totalProblems = await ProblemModel.countDocuments({});
  const totalQuizzes = await QuizModel.countDocuments({});
  const totalWeeklyTests = await WeeklyTestModel.countDocuments({});
  const totalHackathons = await HackathonModel.countDocuments({});
  const totalInterviews = await InterviewModel.countDocuments({});

  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    const query: any = { role: UserRole.STUDENT };
    if (rollNumber) query.rollNumber = { $regex: rollNumber, $options: "i" };
    if (branch) query.branch = { $regex: branch, $options: "i" };
    const students = await UserModel.find(query).lean();
    for (const student of students) {
      const collegeIdStr = student.collegeId?.toString() ?? "";
      const completedProblems = await ProblemModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedQuizzes = await QuizModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedInterviews = await InterviewModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const testScores = await WeeklyTestModel.aggregate([
        { $match: { "scores.userId": student._id } },
        { $unwind: "$scores" },
        { $match: { "scores.userId": student._id } },
        { $group: { _id: null, totalScore: { $sum: "$scores.score" } } },
      ]);

      stats.push({
        studentId: student._id,
        name: student.name,
        email: student.email,
        collegeId: student.collegeId,
        collegeName: student.collegeName,
        completedProblems,
        completedQuizzes,
        completedInterviews,
        totalTestScore: testScores[0]?.totalScore || 0,
        totalProblems,
        totalQuizzes,
        totalWeeklyTests,
        totalHackathons,
        totalInterviews,
        notCompletedProblems: totalProblems - completedProblems,
        notCompletedQuizzes: totalQuizzes - completedQuizzes,
        notCompletedInterviews: totalInterviews - completedInterviews,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: stats,
    message: "All student stats retrieved successfully",
  } as ApiResponse<StudentStats[]>);
});

export const searchStudents: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in searchStudents, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  const isSuperadmin = authReq.user.role === UserRole.SUPERADMIN;
  const isFaculty = authReq.user.role === UserRole.FACULTY;

  if (!isSuperadmin && !isFaculty) {
    logger.warn(
      `Unauthorized attempt to search students, IP=${req.ip}, User=${authReq.user._id?.toString() || "unknown"}`
    );
    return next(createError(403, "Not authorized"));
  }

  const { name, collegeName, rollNumber, branch } = req.query as { name?: string; collegeName?: string; rollNumber?: string; branch?: string };

  if (!name && !collegeName && !rollNumber && !branch) {
    return next(createError(400, "At least one search term is required"));
  }

  let collegesQuery = {};
  if (isFaculty) {
    collegesQuery = { _id: authReq.user.collegeId };
  } else if (collegeName) {
    collegesQuery = { name: { $regex: collegeName, $options: "i" } };
  }

  const colleges = await CollegeModel.find(collegesQuery).lean();
  const stats: StudentStats[] = [];

  const totalProblems = await ProblemModel.countDocuments({});
  const totalQuizzes = await QuizModel.countDocuments({});
  const totalWeeklyTests = await WeeklyTestModel.countDocuments({});
  const totalHackathons = await HackathonModel.countDocuments({});
  const totalInterviews = await InterviewModel.countDocuments({});

  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    const query: any = { role: UserRole.STUDENT };
    if (name) query.name = { $regex: name, $options: "i" };
    if (rollNumber) query.rollNumber = { $regex: rollNumber, $options: "i" };
    if (branch) query.branch = { $regex: branch, $options: "i" };
    const students = await UserModel.find(query).lean();

    for (const student of students) {
      const collegeIdStr = student.collegeId?.toString() ?? "";
      const completedProblems = await ProblemModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedQuizzes = await QuizModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const completedInterviews = await InterviewModel.countDocuments({
        completedBy: { $in: [student._id] },
      });
      const testScores = await WeeklyTestModel.aggregate([
        { $match: { "scores.userId": student._id } },
        { $unwind: "$scores" },
        { $match: { "scores.userId": student._id } },
        { $group: { _id: null, totalScore: { $sum: "$scores.score" } } },
      ]);

      stats.push({
        studentId: student._id,
        name: student.name,
        email: student.email,
        collegeId: student.collegeId,
        collegeName: student.collegeName,
        completedProblems,
        completedQuizzes,
        completedInterviews,
        totalTestScore: testScores[0]?.totalScore || 0,
        totalProblems,
        totalQuizzes,
        totalWeeklyTests,
        totalHackathons,
        totalInterviews,
        notCompletedProblems: totalProblems - completedProblems,
        notCompletedQuizzes: totalQuizzes - completedQuizzes,
        notCompletedInterviews: totalInterviews - completedInterviews,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: stats,
    message: "Students retrieved successfully",
  } as ApiResponse<StudentStats[]>);
});

export const getMyStats: RequestHandler = asyncHandler(async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    logger.warn(`No user data in getMyStats, IP=${req.ip}`);
    return next(createError(401, "Not authenticated"));
  }

  if (authReq.user.role !== UserRole.STUDENT) {
    logger.warn(`Unauthorized attempt to get my stats, IP=${req.ip}`);
    return next(createError(403, "Not authorized"));
  }

  const collegeIdStr = authReq.user.collegeId?.toString() ?? "";
  const completedProblems = await ProblemModel.countDocuments({
    completedBy: { $in: [authReq.user._id] },
  });
  const completedQuizzes = await QuizModel.countDocuments({
    completedBy: { $in: [authReq.user._id] },
  });
  const completedInterviews = await InterviewModel.countDocuments({
    completedBy: { $in: [authReq.user._id] },
  });
  const testScores = await WeeklyTestModel.aggregate([
    { $match: { "scores.userId": authReq.user._id } },
    { $unwind: "$scores" },
    { $match: { "scores.userId": authReq.user._id } },
    { $group: { _id: null, totalScore: { $sum: "$scores.score" } } },
  ]);

  const totalProblems = await ProblemModel.countDocuments({});
  const totalQuizzes = await QuizModel.countDocuments({});
  const totalWeeklyTests = await WeeklyTestModel.countDocuments({});
  const totalHackathons = await HackathonModel.countDocuments({});
  const totalInterviews = await InterviewModel.countDocuments({});

  const stats = {
    studentId: authReq.user._id,
    name: authReq.user.name,
    email: authReq.user.email,
    collegeId: authReq.user.collegeId,
    collegeName: authReq.user.collegeName,
    completedProblems,
    completedQuizzes,
    completedInterviews,
    totalTestScore: testScores[0]?.totalScore || 0,
    totalProblems,
    totalQuizzes,
    totalWeeklyTests,
    totalHackathons,
    totalInterviews,
    notCompletedProblems: totalProblems - completedProblems,
    notCompletedQuizzes: totalQuizzes - completedQuizzes,
    notCompletedInterviews: totalInterviews - completedInterviews,
  };

  res.status(200).json({
    success: true,
    data: stats,
    message: "My stats retrieved successfully",
  } as ApiResponse<StudentStats>);
});



export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const UserModel = getUserModel(req.user.collegeName!);
    const user = await UserModel.findById(req.user._id).select("-password").lean();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const { name, phone } = req.body;
    const UserModel = getUserModel(req.user.collegeName!);
    
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    user.updatedAt = new Date();

    await user.save();

    const updatedUser = await UserModel.findById(req.user._id).select("-password").lean();

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  }
);