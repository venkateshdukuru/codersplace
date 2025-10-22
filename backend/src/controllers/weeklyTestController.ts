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
// CREATE PUBLIC WEEKLY TEST
export const createPublicWeeklyTest: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== "superadmin") {
      return next(createError(403, "Not authorized"));
    }

    const {
      weekNumber,
      title,
      questions,
      questionsModel,
      deadline,
      timeLimit,
      maxScore,
    } = req.body;

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
      maxScore,
      collegeId: null,
      isPublic: true,
      createdAt: new Date(),
    });

    await weeklyTest.save();

    logger.info(`Public weekly test created, TestId=${weeklyTest._id}`);

    res.status(201).json({
      success: true,
      data: weeklyTest,
      message: "Public weekly test created successfully",
    } as ApiResponse<WeeklyTest>);
  }
);

// CREATE COLLEGE-SPECIFIC WEEKLY TEST
export const createCollegeWeeklyTest: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user || !["superadmin", "faculty"].includes(req.user.role)) {
      return next(createError(403, "Not authorized"));
    }

    const {
      collegeId,
      weekNumber,
      title,
      questions,
      questionsModel,
      deadline,
      timeLimit,
      branchSpecific,
      maxScore,
    } = req.body as WeeklyTestPayload;

    // Faculty validation
    if (
      req.user.role === "faculty" &&
      req.user.collegeId?.toString() !== collegeId
    ) {
      return next(createError(403, "Faculty can only create tests for their own college"));
    }

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
      collegeId,
      isPublic: false,
      createdAt: new Date(),
    });

    await weeklyTest.save();

    logger.info(`College weekly test created, CollegeId=${collegeId}, TestId=${weeklyTest._id}`);

    res.status(201).json({
      success: true,
      data: weeklyTest,
      message: "College weekly test created successfully",
    } as ApiResponse<WeeklyTest>);
  }
);

// UPDATE WEEKLY TEST
export const updateWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(
  async (req, res, next) => {
    if (!req.user || req.user.role !== "superadmin") {
      return next(createError(403, "Not authorized"));
    }

    const { testId } = req.params;
    const payload = req.body as Partial<WeeklyTestPayload>;

    const updatePayload: any = { ...payload, updatedAt: new Date() };
    if (payload.deadline) {
      updatePayload.deadline = new Date(payload.deadline);
    }

    const weeklyTest = await WeeklyTestModel.findByIdAndUpdate(
      testId,
      updatePayload,
      { new: true }
    );

    if (!weeklyTest) {
      return next(createError(404, "Weekly test not found"));
    }

    res.status(200).json({
      success: true,
      data: weeklyTest,
      message: "Weekly test updated successfully",
    } as ApiResponse<WeeklyTest>);
  }
);

// DELETE WEEKLY TEST
export const deleteWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(
  async (req, res, next) => {
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
  }
);

// GET WEEKLY TESTS (College-specific first, then public)
export const getWeeklyTests: AuthRequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const { id, title, weekNumber, type } = req.query as {
      id?: string;
      title?: string;
      weekNumber?: string;
      type?: 'all' | 'public' | 'college';
    };

    let query: any = {};
    if (id) query._id = id;
    if (title) query.title = { $regex: title, $options: 'i' };
    if (weekNumber) query.weekNumber = parseInt(weekNumber);

    // Type filter
    if (type === 'public') {
      query.isPublic = true;
    } else if (type === 'college') {
      query.collegeId = req.user.collegeId;
    }

    const allTests = await WeeklyTestModel.find(query).lean();

    // Sort: College-specific first, then public
    const collegeTests = allTests.filter(
      t => t.collegeId?.toString() === req.user?.collegeId?.toString()
    );
    const publicTests = allTests.filter(t => !t.collegeId || t.isPublic);
    const otherCollegeTests = allTests.filter(
      t => t.collegeId && t.collegeId.toString() !== req.user?.collegeId?.toString()
    );

    let sortedTests = [];
    if (req.user.role === "superadmin") {
      sortedTests = [...collegeTests, ...publicTests, ...otherCollegeTests];
    } else {
      // Filter by branch if branchSpecific is set
      const userBranch = req.user.branch;
      const accessibleTests = [...collegeTests, ...publicTests].filter(test => {
        if (!test.branchSpecific || Object.keys(test.branchSpecific).length === 0) {
          return true; // No branch restriction
        }
        return test.branchSpecific[userBranch] !== undefined;
      });
      sortedTests = accessibleTests;
    }

    const testsWithMetadata = sortedTests.map(test => ({
      ...test,
      source: test.collegeId?.toString() === req.user?.collegeId?.toString()
        ? 'your-college'
        : test.isPublic || !test.collegeId
        ? 'public'
        : 'other-college',
    }));

    res.status(200).json({
      success: true,
      data: testsWithMetadata,
      message: "Weekly tests retrieved successfully",
      meta: {
        total: testsWithMetadata.length,
        collegeSpecific: collegeTests.length,
        public: publicTests.length,
      }
    } as ApiResponse<any[]>);
  }
);

// SUBMIT WEEKLY TEST
export const submitWeeklyTest: AuthRequestHandler<{ testId: string }> = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const { testId } = req.params;
    const { answers } = req.body;

    const weeklyTest = await WeeklyTestModel.findById(testId);
    if (!weeklyTest) {
      return next(createError(404, "Weekly test not found"));
    }

    // Check access
    if (weeklyTest.collegeId && 
        weeklyTest.collegeId.toString() !== req.user.collegeId?.toString() &&
        req.user.role !== "superadmin") {
      return next(createError(403, "You don't have access to this test"));
    }

    if (new Date() > weeklyTest.deadline) {
      return next(createError(400, "Deadline passed"));
    }

    // Check branch-specific access
    if (weeklyTest.branchSpecific && Object.keys(weeklyTest.branchSpecific).length > 0) {
      if (!weeklyTest.branchSpecific[req.user.branch || '']) {
        return next(createError(403, "This test is not available for your branch"));
      }
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

    res.status(200).json({
      success: true,
      score,
      message: "Weekly test submitted successfully",
    });
  }
);

