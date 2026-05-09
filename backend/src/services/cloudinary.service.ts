import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

if (env.features.cloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export const cloudinaryService = {
  isConfigured() {
    return env.features.cloudinary;
  },
  async uploadBuffer(buffer: Buffer, folder: string, resourceType: "image" | "video" | "raw" = "image") {
    if (!env.features.cloudinary) {
      throw new AppError("Cloudinary is not configured", 503, "FEATURE_NOT_CONFIGURED");
    }

    const dataUri = `data:application/octet-stream;base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: resourceType,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  },
  async destroy(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
    if (!env.features.cloudinary) {
      throw new AppError("Cloudinary is not configured", 503, "FEATURE_NOT_CONFIGURED");
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  },
};

