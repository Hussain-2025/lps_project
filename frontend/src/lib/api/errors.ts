import axios from "axios";

import type { ApiErrorShape } from "../types";

export function getApiError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data?.error;

    if (apiError?.code && apiError?.message) {
      return apiError as ApiErrorShape;
    }
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Something went wrong. Please try again.",
  };
}
