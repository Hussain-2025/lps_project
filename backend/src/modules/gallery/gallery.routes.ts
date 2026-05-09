import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { roleGuard } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import {
  createAlbumController,
  deleteMediaController,
  getAlbumController,
  listAlbumsController,
  mediaUpload,
  uploadMediaController,
} from "./gallery.controller.js";
import { albumIdParamSchema, createAlbumSchema, mediaIdParamSchema, uploadMediaSchema } from "./gallery.schema.js";

export const galleryRouter = Router();

galleryRouter.get("/albums", listAlbumsController);
galleryRouter.get("/albums/:albumId", validate({ params: albumIdParamSchema }), getAlbumController);
galleryRouter.post("/albums", requireAuth, roleGuard(["admin", "super_admin"]), validate({ body: createAlbumSchema }), createAlbumController);
galleryRouter.post("/media", requireAuth, roleGuard(["admin", "super_admin"]), mediaUpload.single("file"), validate({ body: uploadMediaSchema }), uploadMediaController);
galleryRouter.delete("/media/:id", requireAuth, roleGuard(["admin", "super_admin"]), validate({ params: mediaIdParamSchema }), deleteMediaController);

