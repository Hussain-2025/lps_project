import { z } from "zod";

export const albumIdParamSchema = z.object({
  albumId: z.string().regex(/^[a-f0-9]{24}$/i),
});

export const mediaIdParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
});

export const createAlbumSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).optional(),
  eventDate: z.coerce.date(),
  coverImageUrl: z.string().url().optional(),
  isPublished: z.boolean().optional().default(false),
});

export const uploadMediaSchema = z.object({
  albumId: z.string().regex(/^[a-f0-9]{24}$/i),
  type: z.enum(["photo", "video"]),
  caption: z.string().trim().max(500).optional(),
});

