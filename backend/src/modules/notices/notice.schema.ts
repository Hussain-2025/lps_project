import { z } from "zod";

import { roles } from "../../utils/constants.js";
import { paginationSchema } from "../../utils/pagination.js";

const audienceSchema = z.union([
  z.object({
    kind: z.literal("all"),
  }),
  z.object({
    kind: z.literal("role"),
    value: z.enum(roles),
  }),
  z.object({
    kind: z.literal("class"),
    value: z.string().regex(/^[a-f0-9]{24}$/i),
  }),
]);

export const createNoticeSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(3).max(10000),
  attachmentUrl: z.string().url().optional(),
  audience: audienceSchema,
  tags: z.array(z.string().trim().min(1).max(40)).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export const noticeQuerySchema = paginationSchema.extend({
  tag: z.string().trim().optional(),
  search: z.string().trim().optional(),
  includeUnpublished: z.coerce.boolean().optional().default(false),
});

export const noticeIdParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
});

