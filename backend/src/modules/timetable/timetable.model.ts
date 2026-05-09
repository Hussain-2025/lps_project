import { Schema, model } from "mongoose";

const timetableSchema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academicYear: { type: String, required: true },
    schedule: [
      {
        day: { type: String, required: true },
        periods: [
          {
            periodNo: { type: Number, required: true },
            subject: { type: String, required: true },
            teacherId: { type: Schema.Types.ObjectId, ref: "User" },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

timetableSchema.index({ classId: 1, academicYear: 1 }, { unique: true });

export const TimetableModel = model("Timetable", timetableSchema);

