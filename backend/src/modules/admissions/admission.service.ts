import { cloudinaryService } from "../../services/cloudinary.service.js";
import { emailService } from "../../services/email.service.js";
import { AppError } from "../../utils/appError.js";
import { getPagination } from "../../utils/pagination.js";
import { AdmissionModel } from "./admission.model.js";

export async function submitAdmission(
  input: Record<string, unknown>,
  file?: Express.Multer.File,
) {
  let photoUrl: string | undefined;
  let photoPublicId: string | undefined;

  if (file) {
    const upload = await cloudinaryService.uploadBuffer(file.buffer, "lpsnlp/admissions");
    photoUrl = upload.url;
    photoPublicId = upload.publicId;
  }

  const admission = await AdmissionModel.create({
    ...input,
    photoUrl,
    photoPublicId,
  });

  await emailService.send({
    to: String(input.email),
    subject: "Admission enquiry received",
    text: `Thanks for submitting the admission enquiry for ${String(input.studentName)}.`,
  });

  return admission;
}

export async function listAdmissions(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const q = query as { status?: string; academicYear?: string; search?: string };
  const filter: Record<string, unknown> = { isDeleted: false };

  if (q.status) {
    filter.status = q.status;
  }

  if (q.academicYear) {
    filter.academicYear = q.academicYear;
  }

  if (q.search) {
    filter.$text = { $search: q.search };
  }

  const [data, total] = await Promise.all([
    AdmissionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AdmissionModel.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAdmissionById(id: string) {
  const admission = await AdmissionModel.findOne({ _id: id, isDeleted: false });

  if (!admission) {
    throw new AppError("Admission not found", 404, "NOT_FOUND");
  }

  return admission;
}

export async function updateAdmissionStatus(id: string, input: { status: string; notes?: string }) {
  const admission = await AdmissionModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        status: input.status,
        notes: input.notes,
      },
    },
    { new: true },
  );

  if (!admission) {
    throw new AppError("Admission not found", 404, "NOT_FOUND");
  }

  await emailService.send({
    to: admission.email,
    subject: "Admission status updated",
    text: `Your application status is now ${admission.status}.`,
  });

  return admission;
}

export async function exportAdmissionsCsv(query: unknown) {
  const result = await listAdmissions(query);
  const rows = [
    "studentName,parentName,email,phone,classApplied,status,academicYear,createdAt",
    ...result.data.map((item) =>
      [
        item.studentName,
        item.parentName,
        item.email,
        item.phone,
        item.classApplied,
        item.status,
        item.academicYear,
        item.createdAt.toISOString(),
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ];

  return rows.join("\n");
}
