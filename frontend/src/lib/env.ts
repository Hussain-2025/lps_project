import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENABLE_GOOGLE_OAUTH: z
    .union([z.literal("true"), z.literal("false")])
    .default("false")
    .transform((value) => value === "true"),
  VITE_SCHOOL_NAME: z.string().default("RPM Lovely Public Senior Secondary School"),
});

export const env = envSchema.parse(import.meta.env);
