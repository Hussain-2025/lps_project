import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function getPagination(query: unknown) {
  const parsed = paginationSchema.parse(query);
  const skip = (parsed.page - 1) * parsed.limit;

  return {
    ...parsed,
    skip,
  };
}

