import crypto from "node:crypto";

import type { Request, Response } from "express";
import passport from "passport";

import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { safeCompare } from "../../utils/tokenCompare.js";
import {
  createPasswordReset,
  issueSession,
  loginUser,
  refreshUserSession,
  registerUser,
  resetPassword,
  revokeAllSessions,
  revokeSessionByToken,
} from "./auth.service.js";

function getSessionMeta(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  const session = await issueSession(String(user._id), user.email, user.role, getSessionMeta(req));

  res.cookie("refreshToken", session.refreshToken, session.cookieOptions);

  return sendSuccess(
    res,
    {
      user: user.toJSON(),
      accessToken: session.accessToken,
    },
    201,
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await loginUser(req.body.email, req.body.password);
  const session = await issueSession(String(user._id), user.email, user.role, getSessionMeta(req));

  res.cookie("refreshToken", session.refreshToken, session.cookieOptions);

  return sendSuccess(res, {
    user: user.toJSON(),
    accessToken: session.accessToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401, "UNAUTHORIZED");
  }

  const session = await refreshUserSession(refreshToken, getSessionMeta(req));
  res.cookie("refreshToken", session.refreshToken, session.cookieOptions);

  return sendSuccess(res, {
    accessToken: session.accessToken,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (refreshToken) {
    await revokeSessionByToken(refreshToken);
  }

  res.clearCookie("refreshToken");

  return sendSuccess(res, {
    message: "Logged out successfully",
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await createPasswordReset(req.body.email);

  return sendSuccess(res, {
    message: "If the account exists, a reset email has been sent",
  });
});

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.token, req.body.password);

  return sendSuccess(res, {
    message: "Password reset successful",
  });
});

export const googleAuth = (req: Request, res: Response, next: (error?: unknown) => void) => {
  if (!env.features.googleOAuth) {
    return next(new AppError("Google OAuth is not configured", 503, "FEATURE_NOT_CONFIGURED"));
  }

  const state = crypto.randomBytes(24).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const middleware = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  });

  return middleware(req, res, next);
};

export const googleCallback = (req: Request, res: Response, next: (error?: unknown) => void) => {
  if (!env.features.googleOAuth) {
    return next(new AppError("Google OAuth is not configured", 503, "FEATURE_NOT_CONFIGURED"));
  }

  const expectedState = req.cookies.oauth_state as string | undefined;
  const receivedState = typeof req.query.state === "string" ? req.query.state : "";

  if (!expectedState || !safeCompare(expectedState, receivedState)) {
    return next(new AppError("Invalid OAuth state", 400, "INVALID_OAUTH_STATE"));
  }

  const middleware = passport.authenticate("google", { session: false }, async (error: unknown, user?: { _id: string; email: string; role: "super_admin" | "admin" | "teacher" | "student" | "parent" }) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return next(new AppError("Google authentication failed", 401, "GOOGLE_AUTH_FAILED"));
    }

    const session = await issueSession(String(user._id), user.email, user.role, getSessionMeta(req));
    res.cookie("refreshToken", session.refreshToken, session.cookieOptions);
    res.clearCookie("oauth_state");

    return res.redirect(`${env.CLIENT_URL}/oauth/callback?accessToken=${encodeURIComponent(session.accessToken)}`);
  });

  return middleware(req, res, next);
};

export const logoutEverywhere = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  await revokeAllSessions(userId);
  res.clearCookie("refreshToken");

  return sendSuccess(res, {
    message: "All sessions revoked",
  });
});

