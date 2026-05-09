import multer from "multer";
import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { createAlbum, deleteMedia, getAlbum, listAlbums, uploadMedia } from "./gallery.service.js";

export const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

export const listAlbumsController = asyncHandler(async (_req: Request, res: Response) => {
  const albums = await listAlbums();
  return sendSuccess(res, albums.map((item) => item.toJSON()));
});

export const getAlbumController = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAlbum(req.params.albumId);
  return sendSuccess(res, {
    album: result.album.toJSON(),
    media: result.media.map((item) => item.toJSON()),
  });
});

export const createAlbumController = asyncHandler(async (req: Request, res: Response) => {
  const album = await createAlbum(req.user!.id, req.body);
  return sendSuccess(res, album.toJSON(), 201);
});

export const uploadMediaController = asyncHandler(async (req: Request, res: Response) => {
  const item = await uploadMedia(req.user!.id, req.body, req.file);
  return sendSuccess(res, item.toJSON(), 201);
});

export const deleteMediaController = asyncHandler(async (req: Request, res: Response) => {
  const item = await deleteMedia(req.params.id);
  return sendSuccess(res, item.toJSON());
});

