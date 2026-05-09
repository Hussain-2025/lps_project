import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(5000),
});
