import { Schema, model } from "mongoose";

const noticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    attachmentUrl: { type: String },
    audience: {
      type: {
        kind: { type: String, enum: ["all", "role", "class"], required: true },
        value: { type: String },
      },
      required: true,
    },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

noticeSchema.index({ title: "text", body: "text", tags: "text" });

export const NoticeModel = model("Notice", noticeSchema);

