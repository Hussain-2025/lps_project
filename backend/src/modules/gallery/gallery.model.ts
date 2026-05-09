import { Schema, model } from "mongoose";

const albumSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    eventDate: { type: Date, required: true },
    coverImageUrl: { type: String },
    isPublished: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

const mediaItemSchema = new Schema(
  {
    albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    type: { type: String, enum: ["photo", "video"], required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publicId: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

albumSchema.index({ title: "text", description: "text" });
mediaItemSchema.index({ albumId: 1, isDeleted: 1 });

export const AlbumModel = model("Album", albumSchema);
export const MediaItemModel = model("MediaItem", mediaItemSchema);

