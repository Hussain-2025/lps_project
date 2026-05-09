import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("health endpoints", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "5000";
    process.env.MONGODB_URI = "mongodb://localhost:27017/lpsnlp-test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.CORS_ORIGINS = "http://localhost:5173";
    process.env.JWT_ACCESS_SECRET = "a".repeat(64);
    process.env.JWT_REFRESH_SECRET = "b".repeat(64);
    process.env.ENCRYPTION_KEY = "c".repeat(64);
  });

  afterAll(() => {
    delete process.env.NODE_ENV;
  });

  it("returns 200 on /health", async () => {
    const { app } = await import("../app.js");
    const request = (await import("supertest")).default;
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("returns 503 on /ready without db", async () => {
    const { app } = await import("../app.js");
    const request = (await import("supertest")).default;
    const response = await request(app).get("/ready");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("DB_NOT_READY");
  });
});

