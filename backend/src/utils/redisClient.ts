import { createClient } from 'redis';
import { config } from '../config/env';
import { logger } from './logger';

export const redisClient = createClient({
  url: config.REDIS,
});

redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err}`));
redisClient.on('connect', () => logger.info('Connected to Redis'));

redisClient.connect().catch((err) => logger.error(`Redis Connection Failed: ${err}`));