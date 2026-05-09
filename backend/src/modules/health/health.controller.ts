import type { Request, Response } from "express";

import { isDbReady } from "../../config/db.js";

export function healthController(_req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
    },
  });
}

export function readyController(_req: Request, res: Response) {
  const ready = isDbReady();

  return res.status(ready ? 200 : 503).json({
    success: ready,
    ...(ready
      ? {
          data: { status: "ready" },
        }
      : {
          error: {
            code: "DB_NOT_READY",
            message: "Database connection is not ready",
          },
        }),
  });
}

