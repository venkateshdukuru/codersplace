import { Request, Response, NextFunction } from "express";
import { HackathonModel } from "../models";
import { createError } from "../middleware/errorMiddleware";
import { logger } from "../utils/logger";
import asyncHandler from "../utils/requestHandler";
import { ApiResponse, AuthRequestHandler, Hackathon, HackathonPayload } from "../types";

export const createHackathon: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { title, description, startDate, endDate } = req.body as HackathonPayload;

  if (!title || !startDate || !endDate) {
    return next(createError(400, "Required fields missing"));
  }

  const hackathon = new HackathonModel({
    title,
    description,
    startDate: new Date(startDate), // Convert string to Date for MongoDB
    endDate: new Date(endDate), // Convert string to Date for MongoDB
    createdAt: new Date(),
  });

  await hackathon.save();

  res.status(201).json({
    success: true,
    data: hackathon,
    message: "Hackathon created successfully",
  } as ApiResponse<Hackathon>);
});

export const updateHackathon: AuthRequestHandler<{ hackathonId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { hackathonId } = req.params;
  const payload = req.body as Partial<HackathonPayload>;

  // Convert string dates to Date objects for MongoDB if provided
  const updatePayload: any = { ...payload, updatedAt: new Date() };
  if (payload.startDate) updatePayload.startDate = new Date(payload.startDate);
  if (payload.endDate) updatePayload.endDate = new Date(payload.endDate);

  const hackathon = await HackathonModel.findByIdAndUpdate(hackathonId, updatePayload, { new: true });

  if (!hackathon) {
    return next(createError(404, "Hackathon not found"));
  }

  res.status(200).json({
    success: true,
    data: hackathon,
    message: "Hackathon updated successfully",
  } as ApiResponse<Hackathon>);
});

export const deleteHackathon: AuthRequestHandler<{ hackathonId: string }> = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return next(createError(403, "Not authorized"));
  }

  const { hackathonId } = req.params;

  const hackathon = await HackathonModel.findByIdAndDelete(hackathonId);

  if (!hackathon) {
    return next(createError(404, "Hackathon not found"));
  }

  res.status(200).json({
    success: true,
    message: "Hackathon deleted successfully",
  } as ApiResponse<void>);
});

export const getHackathons: AuthRequestHandler = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }

  const { id, title } = req.query as { id?: string; title?: string };

  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const hackathons = await HackathonModel.find(query);

  res.status(200).json({
    success: true,
    data: hackathons,
    message: "Hackathons retrieved successfully",
  } as ApiResponse<Hackathon[]>);
});


export const getHackathonsPublic = asyncHandler(async (req, res) => {
  const { id, title } = req.query as { id?: string; title?: string };
  let query: any = {};
  if (id) query._id = id;
  if (title) query.title = { $regex: title, $options: 'i' };

  const hackathons = await HackathonModel.find(query);
  res.status(200).json({
    success: true,
    data: hackathons,
    message: "Hackathons retrieved successfully",
  });
});
