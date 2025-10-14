// // PATH: backend/src/models/AdminInvitation.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IAdminInvitation extends Document {
//   token: string;
//   collegeId: mongoose.Types.ObjectId;
//   collegeName: string;
//   createdAt: Date;
//   expiresAt: Date;
// }

// const AdminInvitationSchema = new Schema<IAdminInvitation>({
//   token: { type: String, required: true, unique: true },
//   collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
//   collegeName: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: { type: Date, required: true },
// });

// // TTL index to automatically delete expired invitations
// AdminInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export const AdminInvitationModel = mongoose.model<IAdminInvitation>(
//   'AdminInvitation',
//   AdminInvitationSchema
// );


// backend/src/models/AdminInvitation.ts

import { Schema, model, Types } from 'mongoose';

export interface AdminInvitation {
  token: string;
  collegeId: Types.ObjectId;
  collegeName: string;
  createdAt: Date;
  expiresAt: Date;
}

const adminInvitationSchema = new Schema<AdminInvitation>({
  token: { type: String, required: true, unique: true },
  collegeId: { type: Schema.Types.ObjectId, required: true, ref: 'College' },
  collegeName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const AdminInvitationModel = model<AdminInvitation>('AdminInvitation', adminInvitationSchema);