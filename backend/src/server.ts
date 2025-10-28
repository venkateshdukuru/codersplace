// path: backend/src/server.ts

import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { config } from "./config/env";
import { logger } from "./utils/logger";


const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    logger.info("🟢 Connected to MongoDB");

   

    // Start server
    const server = http.createServer(app);
    const PORT = config.PORT || 5002;

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

  } catch (err: any) {
    logger.error(`❌ Startup error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
