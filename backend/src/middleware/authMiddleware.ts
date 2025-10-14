//backend/src/middleware/authMiddleware.ts
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { createError } from "./errorMiddleware";
import { logger } from "../utils/logger";
import { getUserModel } from "../models";
import { config } from "../config/env";
import { AuthRequest, UserRole } from "../types";

export const protect: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    logger.warn(`No token provided, IP=${req.ip}`);
    return next(createError(401, "Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      role: UserRole;
      collegeId?: string;
      collegeName?: string;
    };

    if (!decoded.collegeName) {
      logger.warn(`Decoded token missing collegeName, IP=${req.ip}`);
      return next(createError(401, "Invalid token payload"));
    }

    const UserModel = getUserModel(decoded.collegeName);
    const user = await UserModel.findById(decoded.id).lean();

    if (!user) {
      logger.warn(`User not found for token, IP=${req.ip}`);
      return next(createError(401, "Not authorized, user not found"));
    }

    authReq.user = {
      ...user,
      _id: user._id,
      role: user.role as UserRole,
      collegeId: user.collegeId ?? undefined,
    };

    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error}, IP=${req.ip}`);
    return next(createError(401, "Not authorized, invalid token"));
  }
};

export const facultyOrSuperadmin: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;

  if (
    !authReq.user ||
    ![UserRole.FACULTY, UserRole.SUPERADMIN].includes(authReq.user.role)
  ) {
    logger.warn(
      `Unauthorized access attempt, IP=${req.ip}, User=${
        authReq.user?._id?.toString() || "unknown"
      }, Role=${authReq.user?.role || "none"}`
    );
    return next(createError(403, "Not authorized as Faculty or Superadmin"));
  }

  next();
};

export const superadminOnly: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;

  if (!authReq.user || authReq.user.role !== UserRole.SUPERADMIN) {
    logger.warn(
      `Unauthorized access attempt, IP=${req.ip}, User=${
        authReq.user?._id?.toString() || "unknown"
      }, Role=${authReq.user?.role || "none"}`
    );
    return next(createError(403, "Not authorized as Superadmin"));
  }

  next();
};

// alias
export const adminOrSuperadmin = facultyOrSuperadmin;


