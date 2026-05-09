import { Schema, model } from "mongoose";

import { examTypes } from "../../utils/constants.js";

const resultSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    examType: { type: String, enum: examTypes, required: true },
    academicYear: { type: String, required: true },
    subjects: [
      {
        name: { type: String, required: true },
        maxMarks: { type: Number, required: true },
        marksObtained: { type: Number, required: true },
        grade: { type: String, required: true },
      },
    ],
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    rank: { type: Number },
    publishedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

resultSchema.index({ studentId: 1, examType: 1, academicYear: 1 }, { unique: true });

export const ResultModel = model("Result", resultSchema);

