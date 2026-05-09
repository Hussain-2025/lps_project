import type { Role } from "../utils/constants.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};

