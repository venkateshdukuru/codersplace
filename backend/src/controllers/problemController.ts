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



// CREATE PUBLIC PROBLEM (No collegeId)
export const createPublicProblem: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { title, description, difficulty, testCases } = req.body;

  if (!title) {
    return next(createError(400, "Title is required"));
  }

  const problem = new ProblemModel({
    title,
    description,
    difficulty,
    testCases,
    collegeId: null, // No college association
    isPublic: true, // Flag to identify public problems
    createdAt: new Date(),
  });

  await problem.save();

  logger.info(`Public problem created by superadmin, ProblemId=${problem._id}`);

  res.status(201).json({
    success: true,
    data: problem,
    message: "Public problem created successfully",
  } as ApiResponse<Problem>);
});

// CREATE COLLEGE-SPECIFIC PROBLEM
export const createCollegeProblem: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || !["superadmin", "faculty"].includes(req.user.role)) {
    return next(createError(403, "Not authorized"));
  }

  const { collegeId, title, description, difficulty, testCases } = req.body as ProblemPayload;

  // If faculty, ensure they can only create for their college
  if (
    req.user.role === "faculty" &&
    req.user.collegeId?.toString() !== collegeId?.toString()
  ) {
    return next(createError(403, "Faculty can only create problems for their own college"));
  }

  if (!title) {
    return next(createError(400, "Title is required"));
  }

  const problem = new ProblemModel({
    title,
    description,
    difficulty,
    testCases,
    collegeId,
    isPublic: false, // College-specific
    createdAt: new Date(),
  });

  await problem.save();

  logger.info(`College problem created, CollegeId=${collegeId}, ProblemId=${problem._id}`);

  res.status(201).json({
    success: true,
    data: problem,
    message: "College problem created successfully",
  } as ApiResponse<Problem>);
});




// UPDATE PROBLEM (works for both public and college-specific)
export const updateProblem: AuthRequestHandler<{ problemId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { problemId } = req.params;
  const payload = req.body as Partial<ProblemPayload>;

  const problem = await ProblemModel.findByIdAndUpdate(
    problemId,
    { ...payload, updatedAt: new Date() },
    { new: true }
  );

  if (!problem) {
    return next(createError(404, "Problem not found"));
  }

  res.status(200).json({
    success: true,
    data: problem,
    message: "Problem updated successfully",
  } as ApiResponse<Problem>);
});


// DELETE PROBLEM
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

// GET PROBLEMS (College-specific first, then public)
export const getProblems: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { id, title, difficulty, type } = req.query as {
    id?: string;
    title?: string;
    difficulty?: string;
    type?: 'all' | 'public' | 'college';
  };

  let query: any = {};

  // Filter by ID or title if provided
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };
  if (difficulty) query.difficulty = difficulty;

  // Type filter
  if (type === 'public') {
    query.isPublic = true;
  } else if (type === 'college') {
    query.collegeId = req.user.collegeId;
  }

  // Fetch all problems
  const allProblems = await ProblemModel.find(query).lean();

  // Sort: College-specific first, then public
const collegeProblems = allProblems.filter(
  p => p.collegeId?.toString() === req.user?.collegeId?.toString()
);

const publicProblems = allProblems.filter(p => !p.collegeId || p.isPublic);

const otherCollegeProblems = allProblems.filter(
  p => p.collegeId && p.collegeId.toString() !== req.user?.collegeId?.toString()
);


  // Combine: Your college first, then public, then others (if superadmin)
  let sortedProblems = [];
  
  if (req.user.role === "superadmin") {
    sortedProblems = [...collegeProblems, ...publicProblems, ...otherCollegeProblems];
  } else {
    // Students and faculty only see their college and public problems
    sortedProblems = [...collegeProblems, ...publicProblems];
  }

  // Add metadata to identify source
  const problemsWithMetadata = sortedProblems.map(problem => ({
    ...problem,
    source: problem.collegeId?.toString() === req.user?.collegeId?.toString()
      ? 'your-college'
      : problem.isPublic || !problem.collegeId
      ? 'public'
      : 'other-college',
    collegeName: problem.collegeId ? 'College Name' : 'Public', // You can populate this
  }));

  res.status(200).json({
    success: true,
    data: problemsWithMetadata,
    message: "Problems retrieved successfully",
    meta: {
      total: problemsWithMetadata.length,
      collegeSpecific: collegeProblems.length,
      public: publicProblems.length,
    }
  } as ApiResponse<any[]>);
});

// SUBMIT PROBLEM
export const submitProblem: AuthRequestHandler<{ problemId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { problemId } = req.params;
  const { code, language } = req.body;

  const problem = await ProblemModel.findById(problemId);
  if (!problem) {
    return next(createError(404, "Problem not found"));
  }

  // Check if student has access to this problem
  if (problem.collegeId && 
      problem.collegeId.toString() !== req.user.collegeId?.toString() &&
      req.user.role !== "superadmin") {
    return next(createError(403, "You don't have access to this problem"));
  }

  // Use Judge0 to evaluate
  const submissions = problem.testCases.map(tc => ({
    source_code: code,
    language_id: language,
    stdin: tc.input,
    expected_output: tc.output,
  }));

  const { data: tokens } = await submitBatch(submissions);
  const results = await pollResults(tokens.map((t: any) => t.token));

  const passed = results.every((r: any) => r.status.id === 3);

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