import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { roleGuard } from "../../middleware/roleGuard.js";
import { validate } from "../../middleware/validate.js";
import {
  createManagedUser,
  deleteManagedUser,
  deleteMe,
  exportMe,
  getManagedUser,
  getMe,
  listAllUsers,
  updateManagedUser,
  updateMe,
} from "./user.controller.js";
import {
  createUserSchema,
  deleteOwnAccountSchema,
  objectIdParamSchema,
  updateUserSchema,
  userListQuerySchema,
} from "./user.schema.js";

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get("/me", getMe);
userRouter.patch("/me", validate({ body: updateUserSchema }), updateMe);
userRouter.delete("/me", validate({ body: deleteOwnAccountSchema }), deleteMe);
userRouter.get("/me/export", exportMe);

userRouter.get("/", roleGuard(["admin", "super_admin"]), validate({ query: userListQuerySchema }), listAllUsers);
userRouter.post("/", roleGuard(["admin", "super_admin"]), validate({ body: createUserSchema }), createManagedUser);
userRouter.get("/:id", roleGuard(["admin", "super_admin"]), validate({ params: objectIdParamSchema }), getManagedUser);
userRouter.patch("/:id", roleGuard(["admin", "super_admin"]), validate({ params: objectIdParamSchema, body: updateUserSchema }), updateManagedUser);
userRouter.delete("/:id", roleGuard(["admin", "super_admin"]), validate({ params: objectIdParamSchema }), deleteManagedUser);

