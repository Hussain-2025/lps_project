import type { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { total: number; page: number; limit: number; totalPages: number },
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
}

