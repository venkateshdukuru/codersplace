// backend/src/controllers/authcontrollers.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { createError } from "../middleware/errorMiddleware";
import asyncHandler from "../utils/requestHandler";
import {
  CollegeModel,
  getUserModel,
  PendingRegistrationModel,
  AdminInvitationModel
} from "../models";
import { UserRole } from "../types";
import { sendMail } from "../config/mail";

// Helper function to generate 6-digit numeric OTP
const generateNumericOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// REGISTRATION WITH OTP VERIFICATION
// ============================================

// Step 1: Initiate registration - Send OTP
export const initiateRegistration = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, collegeName, branch, password, rollNumber } = req.body;

  if (!name || !email || !collegeName || !branch || !password || !rollNumber) {
    return next(createError(400, "All fields are required"));
  }
  if (password.length < 8) {
    return next(createError(400, "Password must be at least 8 characters"));
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(createError(400, "Invalid email format"));
  }

  // Check if college exists, if not create it
  let college = await CollegeModel.findOne({ name: collegeName });
  if (!college) {
    college = new CollegeModel({
      name: collegeName,
      createdAt: new Date(),
    });
    await college.save();
  }

  const UserModel = getUserModel(college.name);

  // Check if user already exists
  const existingUser = await UserModel.findOne({ $or: [{ email }, { rollNumber }] });
  if (existingUser) {
    return next(createError(400, existingUser.email === email
      ? "User with this email already exists"
      : "User with this roll number already exists"));
  }

  // Generate unique user ID
  const userId = uuidv4();

  // Generate 6-digit numeric OTP
  const otp = generateNumericOTP();

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if there's a pending registration for this email
  const existingPending = await PendingRegistrationModel.findOne({ email });

  if (existingPending) {
    // Update existing pending registration
    existingPending.userId = userId; // Generate new UUID 
    existingPending.name = name;
    existingPending.collegeName = collegeName;
    existingPending.collegeId = college._id as Types.ObjectId; // Cast to Types.ObjectId
    existingPending.branch = branch;
    existingPending.rollNumber = rollNumber;
    existingPending.password = hashedPassword;
    existingPending.otp = otp;
    existingPending.createdAt = new Date();
    existingPending.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await existingPending.save();
  } else {
    // Create new pending registration with UUID
    await PendingRegistrationModel.create({
      userId, // Add UUID
      name,
      email,
      collegeName,
      collegeId: college._id as Types.ObjectId, // Cast to Types.ObjectId
      branch,
      rollNumber,
      password: hashedPassword,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
  }

  // Send OTP email
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CodersPlace! 🎉</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for registering with CodersPlace! To complete your registration, please verify your email address using the OTP below:
        </p>
        
        <div style="background: #f9fafb; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${otp}
          </p>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ⏰ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin-top: 20px;">
          Your User ID: <code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">${userId}</code>
        </p>
      </div>
    </div>
  `;

  try {
    await sendMail(email, "Verify Your Email - Registration OTP", html);
    logger.info(`Registration OTP sent to ${email} with userId: ${userId}`);
    
    res.status(200).json({ 
      success: true, 
      message: "OTP sent to your email. Please verify to complete registration.",
      email: email
    });
  } catch (err) {
    logger.error(`Email send failed: ${err}`);
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(500, "Failed to send OTP. Please try again."));
  }
});

// Step 2: Verify OTP and complete registration
export const verifyRegistration = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(createError(400, "Email and OTP are required"));
  }

  // Find pending registration
  const pendingRegistration = await PendingRegistrationModel.findOne({ email });

  if (!pendingRegistration) {
    return next(createError(400, "No pending registration found. Please start registration again."));
  }

  // Check if OTP has expired
  if (new Date() > pendingRegistration.expiresAt) {
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(400, "OTP has expired. Please start registration again."));
  }

  // Verify OTP (exact match, numeric only)
  if (pendingRegistration.otp !== otp) {
    return next(createError(400, "Invalid OTP. Please check and try again."));
  }

  // Get college  
  const college = await CollegeModel.findById(pendingRegistration.collegeId);
  if (!college) {
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(404, "College not found. Please start registration again."));
  }

  const UserModel = getUserModel(college.name);

  // Double-check user doesn't exist
  const existingUser = await UserModel.findOne({
    $or: [{ email }, { rollNumber: pendingRegistration.rollNumber }]
  });

  if (existingUser) {
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(400, existingUser.email === email
      ? "User with this email already exists"
      : "User with this roll number already exists"));
  }

  // Create user with UUID
  const user = new UserModel({
    userId: pendingRegistration.userId, // Use the UUID from pending registration
    name: pendingRegistration.name,
    email: pendingRegistration.email,
    branch: pendingRegistration.branch,
    rollNumber: pendingRegistration.rollNumber,
    password: pendingRegistration.password,
    role: UserRole.STUDENT,
    collegeId: college._id,
    collegeName: college.name,
    createdAt: new Date(),
    emailVerified: true,
  });

  await user.save();
  await PendingRegistrationModel.deleteOne({ email });

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id.toString(),
      userId: (user as any).userId, // Access userId with type assertion
      role: user.role,
      collegeId: user.collegeId?.toString() || "",
      collegeName: user.collegeName,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  logger.info(`User registered successfully: ${email} with userId: ${(user as any).userId}`);

  // Send welcome email with User ID
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CodersPlace! 🎉</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${pendingRegistration.name}</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your registration has been completed successfully! 🎊
        </p>
        
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #166534; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">
            📋 Your Account Details:
          </p>
          <table style="width: 100%; color: #374151;">
            <tr>
              <td style="padding: 8px 0;"><strong>User ID:</strong></td>
              <td style="padding: 8px 0; font-family: monospace;">${(user as any).userId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${pendingRegistration.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>College:</strong></td>
              <td style="padding: 8px 0;">${college.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Branch:</strong></td>
              <td style="padding: 8px 0;">${pendingRegistration.branch}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Roll Number:</strong></td>
              <td style="padding: 8px 0;">${pendingRegistration.rollNumber}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.FRONTEND_URL}/signin" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Login to Your Account
          </a>
        </div>
      </div>
    </div>
  `;

  sendMail(email, "Welcome to CodersPlace - Registration Successful! 🎉", welcomeHtml).catch(err => {
    logger.error(`Welcome email failed: ${err}`);
  });

  res.status(201).json({
    success: true,
    token,
    message: "Registration completed successfully! Welcome aboard!",
    user: {
      id: user._id,
      userId: (user as any).userId, // Include UUID in response
      name: user.name,
      email: user.email,
      role: user.role,
      collegeName: user.collegeName,
    }
  });
});

// Step 3: Resend OTP (keep existing UUID)
export const resendRegistrationOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, "Email is required"));
  }

  const pendingRegistration = await PendingRegistrationModel.findOne({ email });

  if (!pendingRegistration) {
    return next(createError(400, "No pending registration found. Please start registration again."));
  }

  if (new Date() > pendingRegistration.expiresAt) {
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(400, "Registration session expired. Please start registration again."));
  }

  // Generate new 6-digit numeric OTP (but keep the same userId)
  const newOtp = generateNumericOTP();

  pendingRegistration.otp = newOtp;
  pendingRegistration.createdAt = new Date();
  pendingRegistration.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pendingRegistration.save();

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New OTP Request 🔄</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${pendingRegistration.name}</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          You requested a new OTP for email verification. Please use the code below:
        </p>
        
        <div style="background: #f9fafb; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your New Verification Code</p>
          <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${newOtp}
          </p>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            ⏰ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    await sendMail(email, "New Registration OTP", html);
    logger.info(`New registration OTP sent to ${email}`);
    
    res.status(200).json({ 
      success: true, 
      message: "New OTP sent to your email." 
    });
  } catch (err) {
    logger.error(`Email send failed: ${err}`);
    return next(createError(500, "Failed to send OTP. Please try again."));
  }
});

// Admin registration with UUID
export const registerAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token, email, password, name, rollNumber, branch } = req.body;

  if (!token || !email || !password) {
    return next(createError(400, "Token, email, and password are required"));
  }
  if (password.length < 8) {
    return next(createError(400, "Password must be at least 8 characters"));
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(createError(400, "Invalid email format"));
  }

  const invitation = await AdminInvitationModel.findOne({ token });
  if (!invitation) {
    return next(createError(400, 'Invalid or expired invitation'));
  }

  if (new Date() > invitation.expiresAt) {
    await AdminInvitationModel.deleteOne({ token });
    return next(createError(400, 'Invitation has expired'));
  }

  const college = await CollegeModel.findById(invitation.collegeId);
  if (!college) {
    return next(createError(404, 'College not found'));
  }

  const UserModel = getUserModel(invitation.collegeName);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(createError(400, "User with this email already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4(); // Generate UUID for admin

  const user = new UserModel({
    userId, // Add UUID
    name: name || email.split('@')[0],
    email,
    password: hashedPassword,
    role: UserRole.SUPERADMIN,
    collegeId: college._id,
    collegeName: college.name,
    createdAt: new Date(),
    rollNumber: rollNumber || `ADMIN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    branch: branch || 'Administration',
    emailVerified: true,
  });

  await user.save();
  await AdminInvitationModel.deleteOne({ token });

  const jwtToken = jwt.sign(
    {
      id: user._id.toString(),
      userId: (user as any).userId, // Include UUID in JWT
      role: user.role,
      collegeId: user.collegeId?.toString() || "",
      collegeName: user.collegeName,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", jwtToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });

  res.status(201).json({ 
    success: true, 
    token: jwtToken, 
    message: "Admin registered successfully",
    user: {
      id: user._id,
      userId: (user as any).userId, // Include UUID in response
      name: user.name,
      email: user.email,
      role: user.role,
      collegeName: user.collegeName,
    }
  });
});

// Continue with remaining functions (generateAdminInvitation, login, forgotPassword, resetPassword, logout)...
// These remain the same as in your original code

export const generateAdminInvitation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { collegeName, uniqueCode } = req.body;

  if (!collegeName || !uniqueCode) {
    return next(createError(400, "College name and unique code are required"));
  }

  let college = await CollegeModel.findOne({ name: collegeName });
  if (!college) {
    college = new CollegeModel({
      name: collegeName,
      createdAt: new Date(),
    });
    await college.save();
  }

  const invitationToken = crypto.randomBytes(32).toString('hex');

  await AdminInvitationModel.create({
    token: invitationToken,
    collegeId: college._id,
    collegeName: college.name,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const invitationLink = `${config.FRONTEND_URL}/register-admin?token=${invitationToken}`;

  res.status(200).json({
    success: true,
    data: { invitationLink },
    message: "Invitation generated successfully",
  });
});

// ============================================
// LOGIN
// ============================================

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Email and password are required"));
  }

  let user: any = null;
  const colleges = await CollegeModel.find().lean();
  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    user = await UserModel.findOne({ email }).lean();
    if (user) break;
  }

  if (!user) {
    return next(createError(401, "Invalid credentials"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(createError(401, "Invalid credentials"));
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      collegeId: user.collegeId?.toString() || "",
      collegeName: user.collegeName,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const UserModel = getUserModel(user.collegeName);
  await UserModel.updateOne({ _id: user._id }, { lastLogin: new Date() });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, token, message: "Logged in successfully" });
});

// ============================================
// PASSWORD RESET
// ============================================

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, "Email is required"));
  }

  let user: any = null;
  let collegeName: string | undefined;
  const colleges = await CollegeModel.find().lean();
  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    user = await UserModel.findOne({ email });
    if (user) {
      collegeName = college.name;
      break;
    }
  }

  if (!user) {
    return next(createError(404, "User not found"));
  }

  // Generate 6-digit numeric OTP for password reset
  const otp = generateNumericOTP();
  
  // Store OTP in PendingRegistration model (reusing for password reset)
  await PendingRegistrationModel.findOneAndUpdate(
    { email },
    {
      email,
      otp,
      name: user.name,
      collegeName: collegeName,
      collegeId: user.collegeId,
      branch: user.branch,
      rollNumber: user.rollNumber,
      password: user.password,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    { upsert: true, new: true }
  );

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request 🔐</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Please use the OTP below to proceed:
        </p>
        
        <div style="background: #f9fafb; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Password Reset OTP</p>
          <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${otp}
          </p>
        </div>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="color: #991b1b; margin: 0; font-size: 14px;">
            ⏰ <strong>Important:</strong> This OTP will expire in <strong>5 minutes</strong>.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This is an automated email, please do not reply directly to this message.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} CodersPlace. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    await sendMail(email, "Password Reset OTP", html);
    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    logger.error(`Email send failed: ${err}`);
    return next(createError(500, "Failed to send email"));
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(createError(400, "Email, OTP, and new password required"));
  }
  if (newPassword.length < 8) {
    return next(createError(400, "Password must be at least 8 characters"));
  }

  const pendingData = await PendingRegistrationModel.findOne({ email });
  if (!pendingData || pendingData.otp !== otp) {
    return next(createError(400, "Invalid or expired OTP"));
  }

  if (new Date() > pendingData.expiresAt) {
    await PendingRegistrationModel.deleteOne({ email });
    return next(createError(400, "OTP has expired"));
  }

  let user: any = null;
  const colleges = await CollegeModel.find().lean();
  for (const college of colleges) {
    const UserModel = getUserModel(college.name);
    user = await UserModel.findOne({ email });
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updateOne({ _id: user._id }, { password: hashedPassword });
      break;
    }
  }

  if (!user) {
    return next(createError(404, "User not found"));
  }

  await PendingRegistrationModel.deleteOne({ email });

  res.status(200).json({ success: true, message: "Password reset successfully" });
});

// ============================================
// LOGOUT
// ============================================

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});