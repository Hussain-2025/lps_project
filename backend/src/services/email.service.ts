import nodemailer from "nodemailer";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const transporter = env.features.email
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

export const emailService = {
  isConfigured() {
    return Boolean(transporter);
  },
  async send(mail: MailInput) {
    if (!transporter) {
      logger.info("Email provider not configured, skipping send", {
        to: mail.to,
        subject: mail.subject,
      });
      return;
    }

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      ...mail,
    });
  },
};

