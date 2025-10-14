// backend/src/types/index.ts

import { ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  export interface User {
    _id: ObjectId;
    userId: string; // UUID
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
    emailVerified?: boolean;
  }
}

export enum UserRole {
  STUDENT = "student",
  FACULTY = "faculty",
  SUPERADMIN = "superadmin",
}

// Main User interface - ADD userId HERE
export interface User {
  _id: ObjectId;
  userId: string; // ✅ ADD THIS LINE - Unique UUID for each user
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
  emailVerified?: boolean;
  avatar?: { 
    url: string; 
    fileId: string; // ImageKit file ID for deletion
    uploadedAt: Date;
  }
  
}

export interface College {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  completedTasks?: {
    problems: number;
    quizzes: number;
    weeklyTests: number;
    hackathons: number;
    interviews: number;
  };
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
  completedBy: ObjectId[];
}

export interface Problem {
  _id: ObjectId;
  collegeId: string;
  title: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  testCases: { input: string; output: string }[];
  createdAt: Date;
  updatedAt?: Date;
  completedBy: ObjectId[];
}

export interface Quiz {
  _id: ObjectId;
  collegeId: string;
  title: string;
  questions?: { text: string; options: string[]; correct: number; type: "aptitude" | "reasoning" | "verbal" }[];
  createdAt: Date;
  updatedAt?: Date;
  completedBy: ObjectId[];
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
  maxScore: number;
  createdAt: Date;
  updatedAt?: Date;
  completedBy: ObjectId[];
  scores: { userId: ObjectId; score: number }[];
}

export interface Interview {
  _id: ObjectId;
  collegeId: string;
  title: string;
  questions?: { text: string; options: string[]; correct: number }[];
  createdAt: Date;
  updatedAt?: Date;
  completedBy: ObjectId[];
}

export interface StudentStats {
  studentId: ObjectId;
  name: string;
  email: string;
  collegeId?: ObjectId;
  collegeName?: string;
  completedProblems: number;
  completedQuizzes: number;
  completedInterviews: number;
  totalTestScore: number;
  totalProblems: number;
  totalQuizzes: number;
  totalWeeklyTests: number;
  totalHackathons: number;
  totalInterviews: number;
  notCompletedProblems: number;
  notCompletedQuizzes: number;
  notCompletedInterviews: number;
}

export interface CollegeCreationPayload {
  name: string;
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
  questions?: { text: string; options: string[]; correct: number; type: "aptitude" | "reasoning" | "verbal" }[];
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

export interface InterviewPayload {
  collegeId: string;
  title: string;
  questions?: { text: string; options: string[]; correct: number }[];
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