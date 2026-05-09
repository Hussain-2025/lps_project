import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI);
}

export async function disconnectDb() {
  await mongoose.disconnect();
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}

