import { Request, Response, NextFunction } from "express";
import { WeeklyTestModel } from "../models";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import asyncHandler from "../utils/requestHandler";
import { ApiResponse, AuthRequestHandler, WeeklyTest, WeeklyTestPayload } from "../types";

export const createWeeklyTest: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { weekNumber, title, questions, questionsModel, deadline, timeLimit, branchSpecific, maxScore } = req.body as WeeklyTestPayload;

  if (!title || !weekNumber || !questionsModel || !deadline) {
    return next(createError(400, "Required fields missing"));
  }

  const weeklyTest = new WeeklyTestModel({
    weekNumber,
    title,
    questions,
    questionsModel,
    deadline: new Date(deadline),
    timeLimit,
    branchSpecific,
    maxScore,
    createdAt: new Date(),
  });

  await weeklyTest.save();

  res.status(201).json({
    success: true,
    data: weeklyTest,
    message: "Weekly test created successfully",
  } as ApiResponse<WeeklyTest>);
});

export const updateWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { testId } = req.params;
  const payload = req.body as Partial<WeeklyTestPayload>;

  // Convert deadline string to Date for database update, if provided
  const updatePayload: any = { ...payload, updatedAt: new Date() };
  if (payload.deadline) {
    updatePayload.deadline = new Date(payload.deadline);
  }

  const weeklyTest = await WeeklyTestModel.findByIdAndUpdate(testId, updatePayload, { new: true });

  if (!weeklyTest) {
    return next(createError(404, "Weekly test not found"));
  }

  res.status(200).json({
    success: true,
    data: weeklyTest,
    message: "Weekly test updated successfully",
  } as ApiResponse<WeeklyTest>);
});

export const deleteWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { testId } = req.params;

  const weeklyTest = await WeeklyTestModel.findByIdAndDelete(testId);

  if (!weeklyTest) {
    return next(createError(404, "Weekly test not found"));
  }

  res.status(200).json({
    success: true,
    message: "Weekly test deleted successfully",
  } as ApiResponse<void>);
});

export const getWeeklyTests: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { id, title } = req.query as { id?: string; title?: string };

  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const weeklyTests = await WeeklyTestModel.find(query);

  res.status(200).json({
    success: true,
    data: weeklyTests,
    message: "Weekly tests retrieved successfully",
  } as ApiResponse<WeeklyTest[]>);
});

export const submitWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { testId } = req.params;
  const { answers } = req.body;

  const weeklyTest = await WeeklyTestModel.findById(testId);
  if (!weeklyTest) {
    return next(createError(404, "Weekly test not found"));
  }

  if (new Date() > weeklyTest.deadline) {
    return next(createError(400, "Deadline passed"));
  }

  let score = 0;
  weeklyTest.questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });
  score = (score / weeklyTest.questions.length) * (weeklyTest.maxScore || 100);

  if (!weeklyTest.completedBy.includes(req.user._id)) {
    weeklyTest.completedBy.push(req.user._id);
    weeklyTest.scores.push({ userId: req.user._id, score });
    await weeklyTest.save();
  }

  res.status(200).json({ success: true, score });
});