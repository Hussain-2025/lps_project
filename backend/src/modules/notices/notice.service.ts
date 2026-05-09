import sanitizeHtml from "sanitize-html";

import { AppError } from "../../utils/appError.js";
import { getPagination } from "../../utils/pagination.js";
import { NoticeModel } from "./notice.model.js";

function sanitizeNoticeHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      "*": ["style"],
    },
  });
}

export async function createNotice(authorId: string, input: Record<string, unknown>) {
  return NoticeModel.create({
    ...input,
    body: sanitizeNoticeHtml(String(input.body)),
    authorId,
    publishedAt: input.isPublished ? new Date() : undefined,
  });
}

export async function listNotices(query: unknown, isAdminView: boolean) {
  const { page, limit, skip } = getPagination(query);
  const q = query as { tag?: string; search?: string; includeUnpublished?: boolean };
  const filter: Record<string, unknown> = { isDeleted: false };

  if (!isAdminView || !q.includeUnpublished) {
    filter.isPublished = true;
  }

  if (q.tag) {
    filter.tags = q.tag;
  }

  if (q.search) {
    filter.$text = { $search: q.search };
  }

  const [data, total] = await Promise.all([
    NoticeModel.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    NoticeModel.countDocuments(filter),
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

export async function getNoticeById(id: string, isAdminView: boolean) {
  const filter: Record<string, unknown> = { _id: id, isDeleted: false };

  if (!isAdminView) {
    filter.isPublished = true;
  }

  const notice = await NoticeModel.findOne(filter);

  if (!notice) {
    throw new AppError("Notice not found", 404, "NOT_FOUND");
  }

  return notice;
}

export async function updateNotice(id: string, input: Record<string, unknown>) {
  const update = {
    ...input,
    ...(input.body ? { body: sanitizeNoticeHtml(String(input.body)) } : {}),
    ...(input.isPublished ? { publishedAt: new Date() } : {}),
  };

  const notice = await NoticeModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: update },
    { new: true },
  );

  if (!notice) {
    throw new AppError("Notice not found", 404, "NOT_FOUND");
  }

  return notice;
}

export async function deleteNotice(id: string) {
  const notice = await NoticeModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true },
  );

  if (!notice) {
    throw new AppError("Notice not found", 404, "NOT_FOUND");
  }

  return notice;
}
