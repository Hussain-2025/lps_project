import { Types, type Model } from "mongoose";

import { AppError } from "./appError.js";

export async function assertOwnership<T>(
  model: Model<T>,
  resourceId: string,
  ownerField: string,
  ownerId: string,
) {
  const doc = await model.findOne({
    _id: new Types.ObjectId(resourceId),
    [ownerField]: new Types.ObjectId(ownerId),
  });

  if (!doc) {
    throw new AppError("Resource not found", 404, "NOT_FOUND");
  }

  return doc;
}

