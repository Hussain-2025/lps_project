export const roles = [
  "super_admin",
  "admin",
  "teacher",
  "student",
  "parent",
] as const;

export type Role = (typeof roles)[number];

export const admissionStatuses = [
  "submitted",
  "under_review",
  "shortlisted",
  "admitted",
  "rejected",
] as const;

export type AdmissionStatus = (typeof admissionStatuses)[number];

export const attendanceStatuses = ["present", "absent", "late"] as const;
export type AttendanceStatus = (typeof attendanceStatuses)[number];

export const examTypes = [
  "unit_test_1",
  "half_yearly",
  "unit_test_2",
  "annual",
] as const;

export type ExamType = (typeof examTypes)[number];

export const noticeAudienceRoles = ["all", ...roles] as const;

