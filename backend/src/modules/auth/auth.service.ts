import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import type { Profile } from "passport-google-oauth20";

import { env } from "../../config/env.js";
import { emailService } from "../../services/email.service.js";
import { AppError } from "../../utils/appError.js";
import { logger } from "../../utils/logger.js";
import { safeCompare } from "../../utils/tokenCompare.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import type { Role } from "../../utils/constants.js";
import { UserModel } from "../users/user.model.js";

const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

type SessionMeta = {
  ip?: string;
  userAgent?: string;
};

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
  };
}

export async function issueSession(userId: string, email: string, role: Role, sessionMeta: SessionMeta) {
  const sessionId = crypto.randomUUID();
  const refreshToken = signRefreshToken({
    sub: userId,
    sessionId,
    type: "refresh",
  });
  const accessToken = signAccessToken({
    sub: userId,
    email,
    role,
  });
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const decoded = verifyRefreshToken(refreshToken);
  const expiresAt = new Date((decoded.exp ?? 0) * 1000);

  await UserModel.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        sessionId,
        tokenHash,
        ip: sessionMeta.ip,
        userAgent: sessionMeta.userAgent,
        createdAt: new Date(),
        expiresAt,
      },
    },
  });

  return {
    accessToken,
    refreshToken,
    cookieOptions: getCookieOptions(),
  };
}

async function bootstrapRoleDecision(role: Role): Promise<Role> {
  const existingUsers = await UserModel.countDocuments();

  if (existingUsers === 0 && (role === "super_admin" || role === "admin")) {
    return role;
  }

  if (role === "admin" || role === "super_admin" || role === "teacher" || role === "student") {
    throw new AppError("Only admin can create this role", 403, "FORBIDDEN");
  }

  return "parent";
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  classId?: string;
  parentOf?: string[];
}) {
  const existing = await UserModel.findOne({
    email: input.email.toLowerCase(),
    isDeleted: false,
  });

  if (existing) {
    throw new AppError("Email already in use", 409, "CONFLICT");
  }

  const approvedRole = await bootstrapRoleDecision(input.role);
  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: approvedRole,
    phone: input.phone,
    address: input.address,
    classId: input.classId,
    parentOf: input.parentOf ?? [],
  });

  return user;
}

export async function adminCreateUser(
  input: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    address?: string;
    classId?: string;
    parentOf?: string[];
  },
) {
  const existing = await UserModel.findOne({ email: input.email.toLowerCase(), isDeleted: false });

  if (existing) {
    throw new AppError("Email already in use", 409, "CONFLICT");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return UserModel.create({
    ...input,
    email: input.email.toLowerCase(),
    passwordHash,
  });
}

export async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });

  if (!user || !user.passwordHash) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw new AppError("Account temporarily locked", 423, "ACCOUNT_LOCKED");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    const failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
    const update: Record<string, unknown> = { failedLoginAttempts };

    if (failedLoginAttempts >= LOCK_THRESHOLD) {
      update.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
      update.failedLoginAttempts = 0;
    }

    await UserModel.findByIdAndUpdate(user._id, update);
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (user.failedLoginAttempts || user.lockedUntil) {
    await UserModel.findByIdAndUpdate(user._id, {
      failedLoginAttempts: 0,
      $unset: { lockedUntil: 1 },
    });
  }

  return user;
}

export async function refreshUserSession(refreshToken: string, sessionMeta: SessionMeta) {
  let payload: ReturnType<typeof verifyRefreshToken>;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401, "UNAUTHORIZED");
  }

  const user = await UserModel.findOne({
    _id: payload.sub,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("Invalid refresh token", 401, "UNAUTHORIZED");
  }

  const session = user.refreshTokens.find((item) => item.sessionId === payload.sessionId);

  if (!session) {
    await revokeAllSessions(String(user._id));
    throw new AppError("Refresh token reuse detected", 401, "REFRESH_TOKEN_REUSED");
  }

  const matches = await bcrypt.compare(refreshToken, session.tokenHash);

  if (!matches) {
    await revokeAllSessions(String(user._id));
    throw new AppError("Refresh token reuse detected", 401, "REFRESH_TOKEN_REUSED");
  }

  await UserModel.findByIdAndUpdate(user._id, {
    $pull: {
      refreshTokens: {
        sessionId: payload.sessionId,
      },
    },
  });

  return issueSession(String(user._id), user.email, user.role, sessionMeta);
}

export async function revokeAllSessions(userId: string) {
  await UserModel.findByIdAndUpdate(userId, {
    $set: {
      refreshTokens: [],
    },
  });
}

export async function revokeSessionByToken(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await UserModel.findByIdAndUpdate(payload.sub, {
      $pull: {
        refreshTokens: { sessionId: payload.sessionId },
      },
    });
  } catch {
    logger.info("Skipping refresh token cleanup for invalid token");
  }
}

export async function createPasswordReset(email: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });

  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await UserModel.findByIdAndUpdate(user._id, {
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: expiresAt,
  });

  await emailService.send({
    to: user.email,
    subject: "Password reset",
    text: `Use this token to reset your password: ${rawToken}`,
  });
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await UserModel.findOne({
    resetPasswordExpiresAt: { $gt: new Date() },
    isDeleted: false,
  });

  if (!user || !user.resetPasswordTokenHash || !safeCompare(user.resetPasswordTokenHash, tokenHash)) {
    throw new AppError("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await UserModel.findByIdAndUpdate(user._id, {
    passwordHash,
    $unset: {
      resetPasswordTokenHash: 1,
      resetPasswordExpiresAt: 1,
    },
    $set: {
      refreshTokens: [],
    },
  });
}

export async function findOrCreateGoogleUser(profile: Profile) {
  const primaryEmail = profile.emails?.[0]?.value;

  if (!primaryEmail) {
    throw new AppError("Google account email is required", 400, "GOOGLE_EMAIL_REQUIRED");
  }

  const existing = await UserModel.findOne({
    $or: [{ googleId: profile.id }, { email: primaryEmail.toLowerCase() }],
    isDeleted: false,
  });

  if (existing) {
    if (!existing.googleId) {
      existing.googleId = profile.id;
      await existing.save();
    }

    return existing;
  }

  return UserModel.create({
    name: profile.displayName || "Google User",
    email: primaryEmail.toLowerCase(),
    role: "parent",
    googleId: profile.id,
  });
}
