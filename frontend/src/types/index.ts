// src/types/index.ts

export interface User {
  _id: string;
  role: 'student' | 'faculty' | 'superadmin';
  collegeId?: string;
  branch?: string;
}


// frontend/src/types/index.ts

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: TestCase[];
  collegeId?: string;
  isPublic: boolean;
  completedBy: string[];
  createdAt: string;
  updatedAt?: string;
  
  // Metadata added by backend
  source: 'your-college' | 'public' | 'other-college';
  collegeName?: string;
  topic?: string; // Optional, if you add topics later
}

export interface TestCase {
  input: string;
  output: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    total: number;
    collegeSpecific: number;
    public: number;
  };
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  details?: any[];
}

export interface ProblemFilters {
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'all' | 'public' | 'college';
  title?: string;
}


export interface Question {
  question: string;
  options: string[];
  correct: number;
  type?: 'aptitude' | 'reasoning' | 'verbal';
}

export interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  difficulty?: string;
  collegeId?: string;
  isPublic: boolean;
  completedBy: string[];
  source: 'your-college' | 'public' | 'other-college';
  createdAt: Date;
}

export interface WeeklyTest {
  _id: string;
  weekNumber: number;
  title: string;
  questions: Question[];
  questionsModel: string;
  deadline: Date;
  timeLimit?: number;
  branchSpecific?: Record<string, boolean>;
  maxScore: number;
  collegeId?: string;
  isPublic: boolean;
  completedBy: string[];
  scores: Array<{ userId: string; score: number }>;
  source: 'your-college' | 'public' | 'other-college';
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    total: number;
    collegeSpecific: number;
    public: number;
  };
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  score?: number;
  total?: number;
  details?: any[];
}