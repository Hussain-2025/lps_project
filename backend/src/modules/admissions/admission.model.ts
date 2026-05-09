import { Schema, model } from "mongoose";

import { admissionStatuses } from "../../utils/constants.js";

const admissionSchema = new Schema(
  {
    studentName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    classApplied: { type: String, required: true, trim: true },
    parentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    photoUrl: { type: String },
    photoPublicId: { type: String },
    status: { type: String, enum: admissionStatuses, default: "submitted" },
    notes: { type: String, trim: true },
    academicYear: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

admissionSchema.index({ academicYear: 1, status: 1 });
admissionSchema.index({ studentName: "text", parentName: "text", email: "text" });

export const AdmissionModel = model("Admission", admissionSchema);

