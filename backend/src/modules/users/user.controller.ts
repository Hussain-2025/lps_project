import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendPaginated, sendSuccess } from "../../utils/response.js";
import {
  createUser,
  exportOwnData,
  getProfile,
  getUserById,
  listUsers,
  softDeleteUser,
  updateUserById,
} from "./user.service.js";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getProfile(req.user!.id);
  return sendSuccess(res, user.toJSON());
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserById(req.user!.id, req.body);
  return sendSuccess(res, user.toJSON());
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await softDeleteUser(req.user!.id);
  return sendSuccess(res, user.toJSON());
});

export const exportMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await exportOwnData(req.user!.id);
  return sendSuccess(res, data);
});

export const listAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await listUsers(req.query);
  return sendPaginated(res, result.data.map((user) => user.toJSON()), result.pagination);
});

export const createManagedUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  return sendSuccess(res, user.toJSON(), 201);
});

export const getManagedUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  return sendSuccess(res, user.toJSON());
});

export const updateManagedUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserById(req.params.id, req.body);
  return sendSuccess(res, user.toJSON());
});

export const deleteManagedUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await softDeleteUser(req.params.id);
  return sendSuccess(res, user.toJSON());
});

