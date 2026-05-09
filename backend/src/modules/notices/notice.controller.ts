import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendPaginated, sendSuccess } from "../../utils/response.js";
import { createNotice, deleteNotice, getNoticeById, listNotices, updateNotice } from "./notice.service.js";

export const createNoticeController = asyncHandler(async (req: Request, res: Response) => {
  const notice = await createNotice(req.user!.id, req.body);
  return sendSuccess(res, notice.toJSON(), 201);
});

export const listNoticesController = asyncHandler(async (req: Request, res: Response) => {
  const isAdminView = Boolean(req.user && (req.user.role === "admin" || req.user.role === "super_admin" || req.user.role === "teacher"));
  const result = await listNotices(req.query, isAdminView);
  return sendPaginated(res, result.data.map((item) => item.toJSON()), result.pagination);
});

export const getNoticeController = asyncHandler(async (req: Request, res: Response) => {
  const isAdminView = Boolean(req.user && (req.user.role === "admin" || req.user.role === "super_admin" || req.user.role === "teacher"));
  const notice = await getNoticeById(req.params.id, isAdminView);
  return sendSuccess(res, notice.toJSON());
});

export const updateNoticeController = asyncHandler(async (req: Request, res: Response) => {
  const notice = await updateNotice(req.params.id, req.body);
  return sendSuccess(res, notice.toJSON());
});

export const deleteNoticeController = asyncHandler(async (req: Request, res: Response) => {
  const notice = await deleteNotice(req.params.id);
  return sendSuccess(res, notice.toJSON());
});

