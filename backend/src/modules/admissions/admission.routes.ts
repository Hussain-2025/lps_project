import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { roleGuard } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import {
  admissionUpload,
  createAdmission,
  exportAdmissions,
  getAdmission,
  getAdmissions,
  patchAdmissionStatus,
} from "./admission.controller.js";
import {
  admissionIdParamSchema,
  admissionListQuerySchema,
  createAdmissionSchema,
  updateAdmissionStatusSchema,
} from "./admission.schema.js";

export const admissionRouter = Router();

admissionRouter.post("/", admissionUpload.single("photo"), validate({ body: createAdmissionSchema }), createAdmission);
admissionRouter.get("/", requireAuth, roleGuard(["admin", "super_admin"]), validate({ query: admissionListQuerySchema }), getAdmissions);
admissionRouter.get("/export", requireAuth, roleGuard(["admin", "super_admin"]), validate({ query: admissionListQuerySchema }), exportAdmissions);
admissionRouter.get("/:id", requireAuth, roleGuard(["admin", "super_admin"]), validate({ params: admissionIdParamSchema }), getAdmission);
admissionRouter.patch("/:id/status", requireAuth, roleGuard(["admin", "super_admin"]), validate({ params: admissionIdParamSchema, body: updateAdmissionStatusSchema }), patchAdmissionStatus);

