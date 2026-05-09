import { createLogger, format, transports } from "winston";

import { env } from "../config/env.js";

const redactedKeys = [
  "password",
  "passwordHash",
  "token",
  "refreshToken",
  "accessToken",
  "authorization",
  "smtp_pass",
];

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        redactedKeys.includes(key.toLowerCase()) ? "[REDACTED]" : redact(nested),
      ]),
    );
  }

  return value;
}

export const logger = createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, ...meta }) =>
      JSON.stringify({
        timestamp,
        level,
        message,
        ...redact(meta),
      }),
    ),
  ),
  transports: [new transports.Console()],
});

