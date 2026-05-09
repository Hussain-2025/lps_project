import { AppError } from "../../utils/appError.js";
import { getPagination } from "../../utils/pagination.js";
import { adminCreateUser } from "../auth/auth.service.js";
import { UserModel } from "./user.model.js";

export async function getProfile(userId: string) {
  const user = await UserModel.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
}

export async function listUsers(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const q = query as { role?: string; search?: string };
  const filter: Record<string, unknown> = { isDeleted: false };

  if (q.role) {
    filter.role = q.role;
  }

  if (q.search) {
    filter.$or = [
      { name: { $regex: q.search, $options: "i" } },
      { email: { $regex: q.search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
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

export async function createUser(input: Parameters<typeof adminCreateUser>[0]) {
  return adminCreateUser(input);
}

export async function getUserById(id: string) {
  const user = await UserModel.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
}

export async function updateUserById(id: string, input: Record<string, unknown>) {
  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: input },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
}

export async function softDeleteUser(id: string) {
  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date(), refreshTokens: [] } },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
}

export async function exportOwnData(userId: string) {
  const user = await getProfile(userId);

  return {
    profile: user.toJSON(),
  };
}
