// backend/src/models/PendingRegistration.ts

import { Schema, model, Types } from 'mongoose';

export interface PendingRegistration {
  userId: string; // UUID string
  name: string;
  email: string;
  collegeName: string;
  collegeId: Types.ObjectId; // Use Types.ObjectId
  branch: string;
  rollNumber: string;
  password: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const pendingRegistrationSchema = new Schema<PendingRegistration>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  collegeId: { type: Schema.Types.ObjectId, required: true, ref: 'College' },
  branch: { type: String, required: true },
  rollNumber: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const PendingRegistrationModel = model<PendingRegistration>('PendingRegistration', pendingRegistrationSchema);