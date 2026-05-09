import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { registerNotificationSocket } from "../services/notification.service.js";

export function createSocketServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (typeof token !== "string") {
      return next(new Error("UNAUTHORIZED"));
    }

    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: string };
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId as string}`);
    socket.join(`role:${socket.data.role as string}`);
  });

  registerNotificationSocket(io);

  return io;
}

