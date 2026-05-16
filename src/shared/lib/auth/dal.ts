import { cache } from 'react';
import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import { getSessionIdFromCookie } from './session';
import { getSession } from './session-store';

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

/** Загрузить текущего пользователя по cookie-сессии (кеш на запрос) */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) {
    return null;
  }

  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
});

/** Требовать авторизацию; иначе — unauthorized() */
export async function verifySession(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    unauthorized();
  }
  return user;
}

/** Путь для редиректа на логин после 401 (из proxy или текущего URL) */
export async function getLoginRedirectPath(): Promise<string> {
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') ??
    headersList.get('x-url') ??
    '/profile';
  return `/login?next=${encodeURIComponent(pathname)}`;
}
