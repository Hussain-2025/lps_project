import { z } from "zod";

import { roles } from "../../utils/constants.js";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(roles).optional().default("parent"),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  classId: z.string().trim().optional(),
  parentOf: z.array(z.string().trim()).optional().default([]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128),
});
