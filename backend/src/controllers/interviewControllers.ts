import { Request, Response, NextFunction } from "express";
import { InterviewModel } from "../models";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import asyncHandler from "../utils/requestHandler";
import { ApiResponse, AuthRequestHandler, Interview, InterviewPayload } from "../types";

export const createInterview: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { title, questions } = req.body as InterviewPayload;

  if (!title) {
    return next(createError(400, "Title is required"));
  }

  const interview = new InterviewModel({
    title,
    questions,
    createdAt: new Date(),
  });

  await interview.save();

  res.status(201).json({
    success: true,
    data: interview,
    message: "Interview created successfully",
  } as ApiResponse<Interview>);
});

export const updateInterview: AuthRequestHandler<{ interviewId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { interviewId } = req.params;
  const payload = req.body as Partial<InterviewPayload>;

  const interview = await InterviewModel.findByIdAndUpdate(interviewId, { ...payload, updatedAt: new Date() }, { new: true });

  if (!interview) {
    return next(createError(404, "Interview not found"));
  }

  res.status(200).json({
    success: true,
    data: interview,
    message: "Interview updated successfully",
  } as ApiResponse<Interview>);
});

export const deleteInterview: AuthRequestHandler<{ interviewId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { interviewId } = req.params;

  const interview = await InterviewModel.findByIdAndDelete(interviewId);

  if (!interview) {
    return next(createError(404, "Interview not found"));
  }

  res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
  } as ApiResponse<void>);
});

export const getInterviews: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { id, title } = req.query as { id?: string; title?: string };

  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const interviews = await InterviewModel.find(query);

  res.status(200).json({
    success: true,
    data: interviews,
    message: "Interviews retrieved successfully",
  } as ApiResponse<Interview[]>);
});

export const submitInterview: AuthRequestHandler<{ interviewId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { interviewId } = req.params;
  const { answers } = req.body;

  const interview = await InterviewModel.findById(interviewId);
  if (!interview) {
    return next(createError(404, "Interview not found"));
  }

  if (!interview.questions || interview.questions.length === 0) {
    return next(createError(400, "Interview has no questions"));
  }

  let score = 0;
  interview.questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });

  if (!interview.completedBy.includes(req.user._id)) {
    interview.completedBy.push(req.user._id);
    await interview.save();
  }

  res.status(200).json({ success: true, score, total: interview.questions.length });
});





// NEW: Add public function for fetching interviews
export const getInterviewsPublic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id, title } = req.query as { id?: string; title?: string };

  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const interviews = await InterviewModel.find(query);

  res.status(200).json({
    success: true,
    data: interviews,
    message: "Interviews retrieved successfully",
  } as ApiResponse<Interview[]>);
});