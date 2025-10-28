import { createClient } from "redis";
import { config } from "./env";
import { logger } from "../utils/logger";

const redis = createClient({
  url: config.REDIS,
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
    tls: config.REDIS.startsWith("rediss://"),
  },
});

redis.on("connect", () => logger.info("🟢 Redis connected"));
redis.on("error", (err) => logger.error(`❌ Redis error: ${err}`));

export const initRedis = async () => {
  try {
    await redis.connect();
  } catch (err) {
    logger.error(`❌ Failed to connect to Redis: ${err}`);
    process.exit(1); // exit if Redis is critical
  }
};

export default redis;
