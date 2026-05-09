import { z } from "zod";

import { client } from "../../lib/api/client";
import type { ContactSubmission, SuccessResponse } from "../../lib/types";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(5),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContact(values: ContactSubmission) {
  const response = await client.post<SuccessResponse<ContactSubmission>>("/contact", values);
  return response.data.data;
}
