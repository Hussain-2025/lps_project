import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { roleGuard } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import {
  createNoticeController,
  deleteNoticeController,
  getNoticeController,
  listNoticesController,
  updateNoticeController,
} from "./notice.controller.js";
import { createNoticeSchema, noticeIdParamSchema, noticeQuerySchema, updateNoticeSchema } from "./notice.schema.js";

export const noticeRouter = Router();

noticeRouter.get("/", validate({ query: noticeQuerySchema }), listNoticesController);
noticeRouter.get("/:id", validate({ params: noticeIdParamSchema }), getNoticeController);
noticeRouter.post("/", requireAuth, roleGuard(["admin", "super_admin", "teacher"]), validate({ body: createNoticeSchema }), createNoticeController);
noticeRouter.patch("/:id", requireAuth, roleGuard(["admin", "super_admin"]), validate({ params: noticeIdParamSchema, body: updateNoticeSchema }), updateNoticeController);
noticeRouter.delete("/:id", requireAuth, roleGuard(["admin", "super_admin"]), validate({ params: noticeIdParamSchema }), deleteNoticeController);

