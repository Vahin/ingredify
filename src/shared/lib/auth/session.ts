import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from './session-cookie';

const SESSION_TTL_SECONDS = Number(
  process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 30,
);

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Установить cookie с идентификатором сессии */
export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions());
}

/** Удалить cookie сессии */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Прочитать идентификатор сессии из cookie */
export async function getSessionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function getSessionTtlSeconds(): number {
  return SESSION_TTL_SECONDS;
}
