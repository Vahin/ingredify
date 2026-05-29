import Redis, { type RedisOptions } from 'ioredis';

/** Глобальный кеш клиента в dev, чтобы не плодить соединения при HMR */
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL не задан');
  }

  return new Redis(getRedisOptions(url));
}

function getRedisOptions(redisUrl: string): RedisOptions {
  const parsedUrl = new URL(redisUrl);
  const db = parsedUrl.pathname.slice(1);

  return {
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : 6379,
    username: parsedUrl.username
      ? decodeURIComponent(parsedUrl.username)
      : undefined,
    password: parsedUrl.password
      ? decodeURIComponent(parsedUrl.password)
      : undefined,
    db: db ? Number(db) : 0,
    tls: parsedUrl.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: 3,
  };
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
