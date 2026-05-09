import { emailService } from "../../services/email.service.js";
import { ContactModel } from "./contact.model.js";

export async function createContact(input: Record<string, unknown>) {
  const contact = await ContactModel.create(input);

  await emailService.send({
    to: String(input.email),
    subject: "Contact form received",
    text: "Thanks for reaching out to RPM Lovely Public Senior Secondary School.",
  });

  return contact;
}

