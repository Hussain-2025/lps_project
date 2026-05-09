import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { createContact } from "./contact.service.js";

export const createContactController = asyncHandler(async (req: Request, res: Response) => {
  const contact = await createContact(req.body);
  return sendSuccess(res, contact.toJSON(), 201);
});

