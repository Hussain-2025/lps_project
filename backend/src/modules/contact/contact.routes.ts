import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { createContactController } from "./contact.controller.js";
import { createContactSchema } from "./contact.schema.js";

export const contactRouter = Router();

contactRouter.post("/", validate({ body: createContactSchema }), createContactController);

