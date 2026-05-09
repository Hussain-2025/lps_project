import { Schema, model } from "mongoose";

import { attendanceStatuses } from "../../utils/constants.js";

const attendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true, trim: true },
    status: { type: String, enum: attendanceStatuses, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    editHistory: [
      {
        by: { type: Schema.Types.ObjectId, ref: "User", required: true },
        at: { type: Date, required: true },
        from: { type: String },
        to: { type: String },
      },
    ],
  },
  { timestamps: true },
);

attendanceSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

export const AttendanceModel = model("Attendance", attendanceSchema);

