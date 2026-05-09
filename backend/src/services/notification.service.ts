import type { Server } from "socket.io";

let io: Server | null = null;

export function registerNotificationSocket(server: Server) {
  io = server;
}

export const notificationService = {
  notifyUser(userId: string, payload: unknown) {
    io?.to(`user:${userId}`).emit("notification", payload);
  },
};

