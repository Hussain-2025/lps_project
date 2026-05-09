import { Schema, model, type InferSchemaType } from "mongoose";

import { roles } from "../../utils/constants.js";

const refreshTokenSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: roles, required: true, default: "parent" },
    googleId: { type: String, index: true, sparse: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class" },
    parentOf: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refreshTokens: { type: [refreshTokenSchema], default: [] },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.refreshTokens;
        delete ret.resetPasswordTokenHash;
        delete ret.resetPasswordExpiresAt;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isDeleted: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel = model("User", userSchema);

