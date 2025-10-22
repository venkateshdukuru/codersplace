// backend/src/models/index.ts

import mongoose, { Schema, model, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import {
  College,
  Hackathon,
  Problem,
  Quiz,
  WeeklyTest,
  Interview,
  User,
  UserRole,
} from "../types";

// Export the models from separate files
export * from './PendingRegistration';
export * from './AdminInvitation';

const collegeSchema = new Schema<College>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  completedTasks: {
    problems: { type: Number, default: 0 },
    quizzes: { type: Number, default: 0 },
    weeklyTests: { type: Number, default: 0 },
    hackathons: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 }
  },
});

// Define userSchema with userId field
const userSchema = new Schema<User>(
  {
    userId: { 
      type: String, 
      required: true, 
      unique: true, 
      default: () => uuidv4() 
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    branch: { 
      type: String, 
      required: true 
    },
    rollNumber: { 
      type: String, 
      required: true, 
      unique: true
    },
    phone: { 
      type: String 
    },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      required: true 
    },
    collegeId: { 
      type: Schema.Types.ObjectId 
    },
    collegeName: { 
      type: String 
    },
    createdAt: { 
      type: Date, 
      required: true 
    },
    updatedAt: { 
      type: Date 
    },
    lastLogin: { 
      type: Date 
    },
    migrationStatus: { 
      type: String 
    },
    emailVerified: { 
      type: Boolean, 
      default: false 
    },
    avatar: { 
      url: { type: String },
      fileId: { type: String }, // ImageKit file ID for deletion
      uploadedAt: { type: Date }
    },
  },
  {
    timestamps: false, // We're managing createdAt and updatedAt manually
  }
);

// Add compound indexes
userSchema.index({ collegeName: 1, role: 1 });
userSchema.index({ createdAt: -1 });

const hackathonSchema = new Schema<Hackathon>({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  completedBy: [{ type: Schema.Types.ObjectId, default: [] }],
});

const problemSchema = new Schema<Problem>({
  collegeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'College', 
    required: false,
    default: null 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'] 
  },
  testCases: [{ 
    input: String, 
    output: String 
  }],
  createdAt: { 
    type: Date, 
    required: true 
  },
  updatedAt: { 
    type: Date 
  },
  completedBy: [{ 
    type: Schema.Types.ObjectId, 
    default: [] 
  }],
});

const quizSchema = new Schema<Quiz>({
  collegeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'College', 
    required: false,
    default: null 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  title: { 
    type: String, 
    required: true 
  },
  questions: [{
    text: String,
    options: [String],
    correct: Number,
    type: { 
      type: String, 
      enum: ['aptitude', 'reasoning', 'verbal'] 
    }
  }],
  createdAt: { 
    type: Date, 
    required: true 
  },
  updatedAt: { 
    type: Date 
  },
  completedBy: [{ 
    type: Schema.Types.ObjectId, 
    default: [] 
  }],
});

const weeklyTestSchema = new Schema<WeeklyTest>({
  collegeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'College', 
    required: false,
    default: null 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  weekNumber: { 
    type: Number, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  questions: [{
    text: String,
    options: [String],
    correct: Number
  }],
  questionsModel: { 
    type: String, 
    enum: ['Problem', 'Quiz'], 
    required: true 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  timeLimit: { 
    type: Number 
  },
  branchSpecific: { 
    type: Map, 
    of: [Schema.Types.ObjectId] 
  },
  maxScore: { 
    type: Number, 
    default: 100 
  },
  createdAt: { 
    type: Date, 
    required: true 
  },
  updatedAt: { 
    type: Date 
  },
  completedBy: [{ 
    type: Schema.Types.ObjectId, 
    default: [] 
  }],
  scores: [{ 
    userId: Schema.Types.ObjectId, 
    score: Number, 
    default: [] 
  }],
});

const interviewSchema = new Schema<Interview>({
  collegeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'College', 
    required: false,
    default: null 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  title: { 
    type: String, 
    required: true 
  },
  questions: [{
    text: String,
    options: [String],
    correct: Number
  }],
  createdAt: { 
    type: Date, 
    required: true 
  },
  updatedAt: { 
    type: Date 
  },
  completedBy: [{ 
    type: Schema.Types.ObjectId, 
    default: [] 
  }],
});

const userModels: { [key: string]: Model<User> } = {};

export const getUserModel = (collegeName: string): Model<User> => {
  const sanitizedName = collegeName
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/\s+/g, '')
    .replace(/^_/, '')
    .replace(/_$/, '');
  
  const collectionName = `Users_${sanitizedName}`;
  
  if (!userModels[collectionName]) {
    userModels[collectionName] = mongoose.model<User>(
      collectionName,
      userSchema,
      collectionName
    );
  }
  return userModels[collectionName];
};

export const CollegeModel = model<College>('College', collegeSchema);
export const HackathonModel = model<Hackathon>('Hackathon', hackathonSchema);
export const ProblemModel = model<Problem>('Problem', problemSchema);
export const QuizModel = model<Quiz>('Quiz', quizSchema);
export const WeeklyTestModel = model<WeeklyTest>('WeeklyTest', weeklyTestSchema);
export const InterviewModel = model<Interview>('Interview', interviewSchema);