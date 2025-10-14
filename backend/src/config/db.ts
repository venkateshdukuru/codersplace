// src/config/db.ts
import mongoose from "mongoose";
import { config } from "./env";
import { logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      dbName: "codecampus",
      autoIndex: process.env.NODE_ENV !== "production",
      retryWrites: true,
      w: "majority",
    });
    logger.info("✅ MongoDB connected successfully");
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error}`);
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  connectDB();
});

mongoose.connection.on("error", (error) => {
  logger.error(`❌ MongoDB error: ${error}`);
});

export default connectDB;
