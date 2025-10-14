import { Request, Response, NextFunction } from "express";
import { ProblemModel } from "../models";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import asyncHandler from "../utils/requestHandler";
import { ApiResponse, AuthRequestHandler, Problem, ProblemPayload } from "../types";
import { submitBatch, pollResults } from "../config/judge0"; // Assuming for code submission

export const createProblem: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { title, description, difficulty, testCases } = req.body as ProblemPayload;

  if (!title) {
    return next(createError(400, "Title is required"));
  }

  const problem = new ProblemModel({
    title,
    description,
    difficulty,
    testCases,
    createdAt: new Date(),
  });

  await problem.save();

  res.status(201).json({
    success: true,
    data: problem,
    message: "Problem created successfully",
  } as ApiResponse<Problem>);
});

export const updateProblem: AuthRequestHandler<{ problemId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { problemId } = req.params;
  const payload = req.body as Partial<ProblemPayload>;

  const problem = await ProblemModel.findByIdAndUpdate(problemId, { ...payload, updatedAt: new Date() }, { new: true });

  if (!problem) {
    return next(createError(404, "Problem not found"));
  }

  res.status(200).json({
    success: true,
    data: problem,
    message: "Problem updated successfully",
  } as ApiResponse<Problem>);
});

export const deleteProblem: AuthRequestHandler<{ problemId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { problemId } = req.params;

  const problem = await ProblemModel.findByIdAndDelete(problemId);

  if (!problem) {
    return next(createError(404, "Problem not found"));
  }

  res.status(200).json({
    success: true,
    message: "Problem deleted successfully",
  } as ApiResponse<void>);
});

export const getProblems: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { id, title } = req.query as { id?: string; title?: string };

  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const problems = await ProblemModel.find(query);

  res.status(200).json({
    success: true,
    data: problems,
    message: "Problems retrieved successfully",
  } as ApiResponse<Problem[]>);
});

export const submitProblem: AuthRequestHandler<{ problemId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { problemId } = req.params;
  const { code, language } = req.body; // Assume submission has code and language

  const problem = await ProblemModel.findById(problemId);
  if (!problem) {
    return next(createError(404, "Problem not found"));
  }

  // Use Judge0 to evaluate (example)
  const submissions = problem.testCases.map(tc => ({
    source_code: code,
    language_id: language, // e.g., 71 for Python
    stdin: tc.input,
    expected_output: tc.output,
  }));

  const { data: tokens } = await submitBatch(submissions);
  const results = await pollResults(tokens.map((t: any) => t.token));

  const passed = results.every((r: any) => r.status.id === 3); // Accepted

  if (passed) {
    if (!problem.completedBy.includes(req.user._id)) {
      problem.completedBy.push(req.user._id);
      await problem.save();
    }
    res.status(200).json({ success: true, message: "Submission accepted" });
  } else {
    res.status(200).json({ success: false, message: "Submission failed", details: results });
  }
});