import multer from "multer";
import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendPaginated, sendSuccess } from "../../utils/response.js";
import {
  exportAdmissionsCsv,
  getAdmissionById,
  listAdmissions,
  submitAdmission,
  updateAdmissionStatus,
} from "./admission.service.js";

export const admissionUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const createAdmission = asyncHandler(async (req: Request, res: Response) => {
  const admission = await submitAdmission(req.body, req.file);
  return sendSuccess(res, admission.toJSON(), 201);
});

export const getAdmissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await listAdmissions(req.query);
  return sendPaginated(res, result.data.map((item) => item.toJSON()), result.pagination);
});

export const getAdmission = asyncHandler(async (req: Request, res: Response) => {
  const admission = await getAdmissionById(req.params.id);
  return sendSuccess(res, admission.toJSON());
});

export const patchAdmissionStatus = asyncHandler(async (req: Request, res: Response) => {
  const admission = await updateAdmissionStatus(req.params.id, req.body);
  return sendSuccess(res, admission.toJSON());
});

export const exportAdmissions = asyncHandler(async (req: Request, res: Response) => {
  const csv = await exportAdmissionsCsv(req.query);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=admissions.csv");
  res.status(200).send(csv);
});

