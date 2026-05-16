import Redis from 'ioredis';

/** Глобальный кеш клиента в dev, чтобы не плодить соединения при HMR */
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL не задан');
  }
  return new Redis(url, {
    maxRetriesPerRequest: 3,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
