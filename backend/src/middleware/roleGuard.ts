import type { NextFunction, Request, Response } from "express";

import type { Role } from "../utils/constants.js";
import { AppError } from "../utils/appError.js";

export function roleGuard(allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }

    next();
  };
}

