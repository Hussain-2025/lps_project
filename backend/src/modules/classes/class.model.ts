import { Schema, model } from "mongoose";

const classSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true, trim: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: "User" },
    subjects: [
      {
        name: { type: String, required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true },
);

classSchema.index({ name: 1, academicYear: 1 }, { unique: true });

export const ClassModel = model("Class", classSchema);

