import { randomBytes } from 'node:crypto';
import { redis } from '@/shared/lib/redis';
import { getSessionTtlSeconds } from './session';

export type SessionRecord = {
  userId: string;
  createdAt: string;
};

function sessionKey(sessionId: string): string {
  return `session:${sessionId}`;
}

function createSessionId(): string {
  return randomBytes(32).toString('hex');
}

/** Создать сессию в Redis и вернуть её идентификатор */
export async function createSession(userId: string): Promise<string> {
  const sessionId = createSessionId();
  const record: SessionRecord = {
    userId,
    createdAt: new Date().toISOString(),
  };

  await redis.set(
    sessionKey(sessionId),
    JSON.stringify(record),
    'EX',
    getSessionTtlSeconds(),
  );

  return sessionId;
}

/** Получить данные сессии по идентификатору */
export async function getSession(
  sessionId: string,
): Promise<SessionRecord | null> {
  const raw = await redis.get(sessionKey(sessionId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionRecord;
  } catch {
    return null;
  }
}

/** Удалить сессию из Redis */
export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(sessionKey(sessionId));
}
