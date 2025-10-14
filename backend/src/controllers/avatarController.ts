import { Response, NextFunction } from "express";
import { imagekit } from "../config/imagekit";
import { getUserModel } from "../models";
import { createError } from "../middleware/errorMiddleware";
import asyncHandler from "../utils/requestHandler";
import { AuthRequest } from "../types";
import { logger } from "../utils/logger";

export const getImageKitAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authParams = imagekit.getAuthenticationParameters();
      res.status(200).json({
        success: true,
        data: authParams,
      });
    } catch (error) {
      logger.error(`ImageKit auth error: ${error}`);
      return next(createError(500, "Failed to generate authentication parameters"));
    }
  }
);

export const uploadAvatar = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    if (!req.file) {
      return next(createError(400, "No file uploaded"));
    }

    const UserModel = getUserModel(req.user.collegeName!);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    try {
      // Delete old avatar if exists
      if (user.avatar?.fileId) {
        try {
          await imagekit.deleteFile(user.avatar.fileId);
        } catch (deleteError) {
          logger.warn(`Failed to delete old avatar: ${deleteError}`);
        }
      }

      // Upload new avatar to ImageKit
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `avatar_${req.user._id}_${Date.now()}`,
        folder: "/avatars",
        tags: ["avatar", req.user._id.toString()],
        useUniqueFileName: true,
      });   

      // Update user with new avatar
      user.avatar = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        uploadedAt: new Date(),
      };
      user.updatedAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          url: uploadResponse.url,
          fileId: uploadResponse.fileId,
        },
        message: "Avatar uploaded successfully",
      });
    } catch (error) {
      logger.error(`Avatar upload error: ${error}`);
      return next(createError(500, "Failed to upload avatar"));
    }
  }
);

export const deleteAvatar = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, "Not authenticated"));
    }

    const UserModel = getUserModel(req.user.collegeName!);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (!user.avatar?.fileId) {
      return next(createError(400, "No avatar to delete"));
    }

    try {
      // Delete from ImageKit
      await imagekit.deleteFile(user.avatar.fileId);

      // Remove avatar from user
      user.avatar = undefined;
      user.updatedAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        message: "Avatar deleted successfully",
      });
    } catch (error) {
      logger.error(`Avatar deletion error: ${error}`);
      return next(createError(500, "Failed to delete avatar"));
    }
  }
);