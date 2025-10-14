import { ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface User {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    branch: string;
    rollNumber: string;
    phone?: string;
    role: UserRole;
    collegeId?: ObjectId;
    collegeName?: string;
    createdAt: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    migrationStatus?: string;
  }
}

export enum UserRole {
  STUDENT = "student",
  FACULTY = "faculty",
  SUPERADMIN = "superadmin",
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  branch: string;
  rollNumber: string;
  phone?: string;
  role: UserRole;
  collegeId?: ObjectId;
  collegeName?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  migrationStatus?: string;
}

export interface College {
  _id: ObjectId;
  name: string;
  subdomain: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Hackathon {
  _id: ObjectId;
  collegeId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt?: Date;
  completedBy?: ObjectId[];
}

export interface Problem {
  _id: ObjectId;
  collegeId: string;
  title: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  testCases?: { input: string; output: string }[];
  createdAt: Date;
  updatedAt?: Date;
  completedBy?: ObjectId[];
}

export interface Quiz {
  _id: ObjectId;
  collegeId: string;
  title: string;
  questions?: { text: string; options: string[]; correct: number }[];
  createdAt: Date;
  updatedAt?: Date;
  completedBy?: ObjectId[];
}

export interface WeeklyTest {
  _id: ObjectId;
  collegeId: string;
  weekNumber: number;
  title: string;
  questions: { text: string; options: string[]; correct: number }[];
  questionsModel: "Problem" | "Quiz";
  deadline: Date;
  timeLimit?: number;
  branchSpecific?: Record<string, ObjectId[]>;
  maxScore?: number;
  createdAt: Date;
  updatedAt?: Date;
  completedBy?: ObjectId[];
  scores?: { userId: ObjectId; score: number }[];
}

export interface StudentStats {
  studentId: ObjectId;
  name: string;
  email: string;
  collegeId?: ObjectId;
  collegeName?: string;
  completedProblems: number;
  completedQuizzes: number;
  totalTestScore: number;
  totalProblems: number;
  totalQuizzes: number;
  totalWeeklyTests: number;
  totalHackathons: number;
  notCompletedProblems: number;
  notCompletedQuizzes: number;
}

export interface CollegeCreationPayload {
  name: string;
  subdomain: string;
}

export interface HackathonPayload {
  collegeId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface ProblemPayload {
  collegeId: string;
  title: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  testCases?: { input: string; output: string }[];
}

export interface QuizPayload {
  collegeId: string;
  title: string;
  questions?: { text: string; options: string[]; correct: number }[];
}

export interface WeeklyTestPayload {
  collegeId: string;
  weekNumber: number;
  title: string;
  questions: { text: string; options: string[]; correct: number }[];
  questionsModel: "Problem" | "Quiz";
  deadline: string;
  timeLimit?: number;
  branchSpecific?: Record<string, string[]>;
  maxScore?: number;
}

export interface MigrationRequestPayload {
  userId: string;
  collegeName: string;
  accessKey: string;
}

export interface FacultyManagementPayload {
  collegeId: string;
  userId: string;
  action: "add" | "remove";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export type AuthRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = (
  req: AuthRequest & Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<void> | void;