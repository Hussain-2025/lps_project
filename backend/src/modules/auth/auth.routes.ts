import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { validate } from "../../middleware/validate.js";
import {
  forgotPassword,
  googleAuth,
  googleCallback,
  login,
  logout,
  logoutEverywhere,
  refresh,
  register,
  resetPasswordController,
} from "./auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), register);
authRouter.post("/login", validate({ body: loginSchema }), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.post("/logout-all", requireAuth, logoutEverywhere);
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleCallback);
authRouter.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
authRouter.post("/reset-password", validate({ body: resetPasswordSchema }), resetPasswordController);

