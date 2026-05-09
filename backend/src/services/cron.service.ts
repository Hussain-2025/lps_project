import cron from "node-cron";

import { logger } from "../utils/logger.js";

let started = false;

export function startCronJobs() {
  if (started) {
    return;
  }

  started = true;

  cron.schedule("0 8 * * *", () => {
    logger.info("Daily cron heartbeat");
  });
}

