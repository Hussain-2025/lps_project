import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";

export const razorpayService = {
  isConfigured() {
    return env.features.razorpay;
  },
  async assertConfigured() {
    if (!env.features.razorpay) {
      throw new AppError("Razorpay is not configured", 503, "FEATURE_NOT_CONFIGURED");
    }
  },
};

