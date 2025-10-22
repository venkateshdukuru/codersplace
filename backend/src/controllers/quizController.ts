import { ObjectId } from "mongodb";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import { QuizModel, CollegeModel } from "../models";
import {
  ApiResponse,
  Quiz,
  QuizPayload,
  UserRole,
  AuthRequestHandler,
} from "../types";
import asyncHandler from "../utils/requestHandler";

// ---------------- CREATE QUIZ ----------------
export const createQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to create quiz, IP=${req.ip}, User=${
          req.user?._id?.toString() || "unknown"
        }`
      );
      return next(createError(403, "Not authorized"));
    }

    const payload = req.body as QuizPayload;
    const quiz = new QuizModel({
      ...payload,
      collegeId: payload.collegeId,
      questions: payload.questions || [],
      completedBy: [],
      createdAt: new Date(),
    });

    await quiz.save();

    await CollegeModel.findByIdAndUpdate(payload.collegeId, {
      $inc: { "completedTasks.quizzes": 1 },
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz created successfully",
    } as ApiResponse<Quiz>);
  }
);
// CREATE PUBLIC QUIZ
export const createPublicQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      return next(createError(403, "Not authorized"));
    }

    const { title, questions } = req.body;

    const quiz = new QuizModel({
      title,
      questions: questions || [],
      collegeId: null,
      isPublic: true,
      completedBy: [],
      createdAt: new Date(),
    });

    await quiz.save();

    logger.info(`Public quiz created, QuizId=${quiz._id}`);

    res.status(201).json({
      success: true,
      data: quiz,
      message: "Public quiz created successfully",
    } as ApiResponse<Quiz>);
  }
);

// CREATE COLLEGE-SPECIFIC QUIZ
export const createCollegeQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || !["superadmin", "faculty"].includes(req.user.role)) {
      return next(createError(403, "Not authorized"));
    }

    const payload = req.body as QuizPayload;

    // Faculty validation
    if (
      req.user.role === "faculty" &&
      req.user.collegeId?.toString() !== payload.collegeId.toString()
    ) {
      return next(createError(403, "Faculty can only create quizzes for their own college"));
    }

    const quiz = new QuizModel({
      ...payload,
      collegeId: payload.collegeId,
      isPublic: false,
      questions: payload.questions || [],
      completedBy: [],
      createdAt: new Date(),
    });

    await quiz.save();

    await CollegeModel.findByIdAndUpdate(payload.collegeId, {
      $inc: { "completedTasks.quizzes": 1 },
    });

    logger.info(`College quiz created, CollegeId=${payload.collegeId}, QuizId=${quiz._id}`);

    res.status(201).json({
      success: true,
      data: quiz,
      message: "College quiz created successfully",
    } as ApiResponse<Quiz>);
  }
);

// UPDATE QUIZ
export const updateQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      return next(createError(403, "Not authorized"));
    }

    const { quizId } = req.params as { quizId: string };
    const payload = req.body as Partial<QuizPayload>;

    const update: Partial<Quiz> = { updatedAt: new Date() };
    if (payload.title) update.title = payload.title;
    if (payload.questions) update.questions = payload.questions;

    const quiz = await QuizModel.findByIdAndUpdate(
      new ObjectId(quizId),
      update,
      { new: true }
    );

    if (!quiz) {
      return next(createError(404, "Quiz not found"));
    }

    res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz updated successfully",
    } as ApiResponse<Quiz>);
  }
);

// DELETE QUIZ
export const deleteQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      return next(createError(403, "Not authorized"));
    }

    const { quizId } = req.params as { quizId: string };
    const quiz = await QuizModel.findByIdAndDelete(new ObjectId(quizId));

    if (!quiz) {
      return next(createError(404, "Quiz not found"));
    }

    if (quiz.collegeId) {
      await CollegeModel.findByIdAndUpdate(quiz.collegeId, {
        $inc: { "completedTasks.quizzes": -1 },
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    } as ApiResponse<void>);
  }
);

// GET QUIZZES (College-specific first, then public)
export const getQuizzes: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const { type, difficulty } = req.query as {
      type?: 'all' | 'public' | 'college' | 'aptitude' | 'reasoning' | 'verbal';
      difficulty?: string;
    };

    let query: any = {};
    if (difficulty) query.difficulty = difficulty;

    // Type filter
    if (type === 'public') {
      query.isPublic = true;
    } else if (type === 'college') {
      query.collegeId = req.user.collegeId;
    } else if (['aptitude', 'reasoning', 'verbal'].includes(type || '')) {
      query['questions.type'] = type;
    }

    const allQuizzes = await QuizModel.find(query).lean();

    // Sort: College-specific first, then public
    const collegeQuizzes = allQuizzes.filter(
      q => q.collegeId?.toString() === req.user?.collegeId?.toString()
    );
    const publicQuizzes = allQuizzes.filter(q => !q.collegeId || q.isPublic);
    const otherCollegeQuizzes = allQuizzes.filter(
      q => q.collegeId && q.collegeId.toString() !== req.user?.collegeId?.toString()
    );

    let sortedQuizzes = [];
    if (req.user.role === UserRole.SUPERADMIN) {
      sortedQuizzes = [...collegeQuizzes, ...publicQuizzes, ...otherCollegeQuizzes];
    } else {
      sortedQuizzes = [...collegeQuizzes, ...publicQuizzes];
    }

    const quizzesWithMetadata = sortedQuizzes.map(quiz => ({
      ...quiz,
      source: quiz.collegeId?.toString() === req.user?.collegeId?.toString()
        ? 'your-college'
        : quiz.isPublic || !quiz.collegeId
        ? 'public'
        : 'other-college',
    }));

    res.status(200).json({
      success: true,
      data: quizzesWithMetadata,
      message: "Quizzes retrieved successfully",
      meta: {
        total: quizzesWithMetadata.length,
        collegeSpecific: collegeQuizzes.length,
        public: publicQuizzes.length,
      }
    } as ApiResponse<any[]>);
  }
);

// SUBMIT QUIZ
export const submitQuiz: AuthRequestHandler<{ quizId: string }> = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.STUDENT) {
      return next(createError(403, "Not authorized"));
    }

    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return next(createError(404, "Quiz not found"));
    }

    // Check access
    if (quiz.collegeId && 
        quiz.collegeId.toString() !== req.user.collegeId?.toString()) {
      return next(createError(403, "You don't have access to this quiz"));
    }

    // Calculate score
    let score = 0;
    (quiz.questions ?? []).forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    if (!quiz.completedBy.includes(req.user._id)) {
      quiz.completedBy.push(req.user._id);
      await quiz.save();
    }

    res.status(200).json({
      success: true,
      message: "Quiz submitted",
      score,
      total: quiz.questions?.length ?? 0,
    });
  }
);