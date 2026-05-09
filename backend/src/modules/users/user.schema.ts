import { z } from "zod";

import { roles } from "../../utils/constants.js";
import { paginationSchema } from "../../utils/pagination.js";

export const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(roles),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  classId: z.string().regex(/^[a-f0-9]{24}$/i).optional(),
  parentOf: z.array(z.string().regex(/^[a-f0-9]{24}$/i)).optional().default([]),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  profilePhoto: z.string().url().optional(),
  classId: z.string().regex(/^[a-f0-9]{24}$/i).nullable().optional(),
  parentOf: z.array(z.string().regex(/^[a-f0-9]{24}$/i)).optional(),
  role: z.enum(roles).optional(),
});

export const userListQuerySchema = paginationSchema.extend({
  role: z.enum(roles).optional(),
  search: z.string().trim().optional(),
});

export const deleteOwnAccountSchema = z.object({
  confirmation: z.literal("DELETE"),
});
