import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import * as Sentry from "@sentry/node";

import { configurePassport } from "./config/passport.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { admissionRouter } from "./modules/admissions/admission.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { contactRouter } from "./modules/contact/contact.routes.js";
import { galleryRouter } from "./modules/gallery/gallery.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { noticeRouter } from "./modules/notices/notice.routes.js";
import { userRouter } from "./modules/users/user.routes.js";

if (env.features.sentry) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      return event;
    },
  });
}

configurePassport();

const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health" || req.path === "/ready",
});

const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

export const app = express();

app.use(healthRouter);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());
app.use("/api", globalLimiter);
app.use("/api/v1/auth", authLimiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admissions", admissionRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/contact", contactRouter);

if (env.features.sentry) {
  app.use((error: unknown, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
    Sentry.captureException(error);
    next(error);
  });
}

app.use(errorHandler);
