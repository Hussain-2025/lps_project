import { z } from "zod";

import { admissionStatuses } from "../../utils/constants.js";
import { paginationSchema } from "../../utils/pagination.js";

export const createAdmissionSchema = z.object({
  studentName: z.string().trim().min(2).max(120),
  dob: z.coerce.date(),
  classApplied: z.string().trim().min(1).max(50),
  parentName: z.string().trim().min(2).max(120),
  email: z.string().email(),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(10).max(500),
  academicYear: z.string().trim().min(4).max(20),
});

export const admissionListQuerySchema = paginationSchema.extend({
  status: z.enum(admissionStatuses).optional(),
  academicYear: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export const admissionIdParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
});

export const updateAdmissionStatusSchema = z.object({
  status: z.enum(admissionStatuses),
  notes: z.string().trim().max(500).optional(),
});
