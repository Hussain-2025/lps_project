import http from "node:http";

import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { startCronJobs } from "./services/cron.service.js";
import { createSocketServer } from "./sockets/index.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  await connectDb();
  startCronJobs();

  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    logger.info("Server started", {
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
    });
  });
}

void bootstrap().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});

