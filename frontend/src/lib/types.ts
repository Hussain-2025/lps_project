export type Role = "super_admin" | "admin" | "teacher" | "student" | "parent";

export type ApiErrorShape = {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: ApiErrorShape;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  classId?: string | null;
  parentOf?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Admission = {
  _id: string;
  studentName: string;
  dob: string;
  classApplied: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl?: string;
  status: "submitted" | "under_review" | "shortlisted" | "admitted" | "rejected";
  notes?: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
};

export type NoticeAudience =
  | { kind: "all" }
  | { kind: "role"; value: Role }
  | { kind: "class"; value: string };

export type Notice = {
  _id: string;
  title: string;
  body: string;
  attachmentUrl?: string;
  audience: NoticeAudience;
  tags: string[];
  publishedAt?: string;
  isPublished: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type Album = {
  _id: string;
  title: string;
  description?: string;
  eventDate: string;
  coverImageUrl?: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  _id: string;
  albumId: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  uploadedBy: string;
  publicId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};
