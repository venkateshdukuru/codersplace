import { RequestHandler } from 'express';
import { z } from 'zod';
import { createError } from './errorMiddleware';
import { logger } from '../utils/logger';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  collegeName: z.string().min(1, 'College name is required'),
  branch: z.string().min(1, 'Branch is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const adminRegisterSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').optional(),
  rollNumber: z.string().min(1, 'Roll number is required').optional(),
  branch: z.string().min(1, 'Branch is required').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(6, 'OTP is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

const adminInvitationSchema = z.object({
  collegeName: z.string().min(1, 'College name is required'),
  uniqueCode: z.string().min(1, 'Unique code is required'),
});

const collegeSchema = z.object({
  name: z.string().min(1, 'College name is required'),
});

const hackathonSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

const problemSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  testCases: z.array(z.object({ input: z.string(), output: z.string() })).optional(),
});

const quizSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  title: z.string().min(1, 'Title is required'),
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()),
    correct: z.number(),
    type: z.enum(['aptitude', 'reasoning', 'verbal']),
  })).optional(),
});

const weeklyTestSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  weekNumber: z.number().int().min(1, 'Week number must be a positive integer'),
  title: z.string().min(1, 'Title is required'),
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()),
    correct: z.number(),
  })).min(1, 'At least one question is required'),
  questionsModel: z.enum(['Problem', 'Quiz']),
  deadline: z.string().min(1, 'Deadline is required'),
  timeLimit: z.number().int().min(1, 'Time limit must be a positive integer').optional(),
  branchSpecific: z
    .record(z.string(), z.array(z.string().min(1, 'Question ID is required')))
    .optional(),
  maxScore: z.number().int().min(1, 'Max score must be a positive integer').optional(),
});

const interviewSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  title: z.string().min(1, 'Title is required'),
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()),
    correct: z.number(),
  })).optional(),
});

const migrationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  collegeName: z.string().min(1, 'College name is required'),
  accessKey: z.string().min(1, 'Access key is required'),
});

const facultyManagementSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['add', 'remove']),
});

const validate =
  (schema: z.ZodSchema): RequestHandler =>
  async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      logger.warn(`Validation failed, IP=${req.ip}, Error=${(error as any).message}`);
      next(createError(400, (error as any).message));
    }
  };



  // backend/src/middleware/validationMiddleware.ts

const registerInitiateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  collegeName: z.string().min(1, 'College name is required'),
  branch: z.string().min(1, 'Branch is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 characters'),
});

const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Export the validations
export const registerInitiateValidation = validate(registerInitiateSchema);
export const registerVerifyValidation = validate(registerVerifySchema);
export const resendOtpValidation = validate(resendOtpSchema);

export const registerValidation = validate(registerSchema);
export const adminRegisterValidation = validate(adminRegisterSchema);
export const loginValidation = validate(loginSchema);
export const forgotPasswordValidation = validate(forgotPasswordSchema);
export const resetPasswordValidation = validate(resetPasswordSchema);
export const adminInvitationValidation = validate(adminInvitationSchema);
export const collegeValidation = validate(collegeSchema);
export const hackathonValidation = validate(hackathonSchema);
export const problemValidation = validate(problemSchema);
export const quizValidation = validate(quizSchema);
export const weeklyTestValidation = validate(weeklyTestSchema);
export const interviewValidation = validate(interviewSchema);
export const migrationValidation = validate(migrationSchema);
export const facultyManagementValidation = validate(facultyManagementSchema);