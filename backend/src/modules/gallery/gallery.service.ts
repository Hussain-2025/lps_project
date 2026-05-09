import { cloudinaryService } from "../../services/cloudinary.service.js";
import { AppError } from "../../utils/appError.js";
import { AlbumModel, MediaItemModel } from "./gallery.model.js";

export async function listAlbums() {
  return AlbumModel.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
}

export async function getAlbum(albumId: string) {
  const album = await AlbumModel.findOne({ _id: albumId, isDeleted: false, isPublished: true });

  if (!album) {
    throw new AppError("Album not found", 404, "NOT_FOUND");
  }

  const media = await MediaItemModel.find({ albumId, isDeleted: false }).sort({ createdAt: -1 });

  return {
    album,
    media,
  };
}

export async function createAlbum(createdBy: string, input: Record<string, unknown>) {
  return AlbumModel.create({
    ...input,
    createdBy,
  });
}

export async function uploadMedia(
  uploadedBy: string,
  input: { albumId: string; type: "photo" | "video"; caption?: string },
  file?: Express.Multer.File,
) {
  if (!file) {
    throw new AppError("Media file is required", 400, "VALIDATION_ERROR");
  }

  const album = await AlbumModel.findOne({ _id: input.albumId, isDeleted: false });

  if (!album) {
    throw new AppError("Album not found", 404, "NOT_FOUND");
  }

  const upload = await cloudinaryService.uploadBuffer(
    file.buffer,
    "lpsnlp/gallery",
    input.type === "video" ? "video" : "image",
  );

  const mediaItem = await MediaItemModel.create({
    albumId: input.albumId,
    type: input.type,
    url: upload.url,
    thumbnailUrl: input.type === "photo" ? upload.url : undefined,
    caption: input.caption,
    uploadedBy,
    publicId: upload.publicId,
  });

  if (!album.coverImageUrl && input.type === "photo") {
    album.coverImageUrl = upload.url;
    await album.save();
  }

  return mediaItem;
}

export async function deleteMedia(id: string) {
  const mediaItem = await MediaItemModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true },
  );

  if (!mediaItem) {
    throw new AppError("Media not found", 404, "NOT_FOUND");
  }

  return mediaItem;
}

