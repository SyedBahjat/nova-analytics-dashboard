// biome-ignore lint/style/useImportType: runtime import needed for class instantiation
// eslint-disable-next-line no-restricted-imports
import { UmamiRedisClient as RedisClient } from '@umami/redis-client';

const REDIS = 'redis';
const enabled = !!process.env.REDIS_URL;

function getClient() {
  const redis = new RedisClient({ url: process.env.REDIS_URL });

  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any)[REDIS] = redis;
  }

  return redis;
}

const client = (globalThis as any)[REDIS] || getClient();

export default { client, enabled };
