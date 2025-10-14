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

// ---------------- UPDATE QUIZ ----------------
export const updateQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to update quiz, IP=${req.ip}, User=${
          req.user?._id?.toString() || "unknown"
        }`
      );
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
      logger.warn(`Quiz not found, ID=${quizId}, IP=${req.ip}`);
      return next(createError(404, "Quiz not found"));
    }

    res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz updated successfully",
    } as ApiResponse<Quiz>);
  }
);

// ---------------- DELETE QUIZ ----------------
export const deleteQuiz: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== UserRole.SUPERADMIN) {
      logger.warn(
        `Unauthorized attempt to delete quiz, IP=${req.ip}, User=${
          req.user?._id?.toString() || "unknown"
        }`
      );
      return next(createError(403, "Not authorized"));
    }

    const { quizId } = req.params as { quizId: string };
    const quiz = await QuizModel.findByIdAndDelete(new ObjectId(quizId));

    if (!quiz) {
      logger.warn(`Quiz not found, ID=${quizId}, IP=${req.ip}`);
      return next(createError(404, "Quiz not found"));
    }

    await CollegeModel.findByIdAndUpdate(quiz.collegeId, {
      $inc: { "completedTasks.quizzes": -1 },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    } as ApiResponse<void>);
  }
);

// ---------------- GET QUIZZES ----------------
export const getQuizzes: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const query = req.user.role === UserRole.SUPERADMIN ? {} : { collegeId: req.user.collegeId };
    const quizzes = await QuizModel.find(query).lean();

    res.status(200).json({
      success: true,
      data: quizzes,
      message: "Quizzes retrieved successfully",
    } as ApiResponse<Quiz[]>);
  }
);

// Submit quiz
export const submitQuiz: AuthRequestHandler<{ quizId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== UserRole.STUDENT) {
    return next(createError(403, "Not authorized"));
  }

  const { quizId } = req.params;
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) {
    return next(createError(404, "Quiz not found"));
  }

  if (!quiz.completedBy.includes(req.user._id)) {
    quiz.completedBy.push(req.user._id);
    await quiz.save();
  }

  res.status(200).json({ success: true, message: "Quiz submitted" });
});