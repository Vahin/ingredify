import { headers } from 'next/headers';

/** Защищённые маршруты — без сессии недоступны */
export function isProtectedPath(pathname: string): boolean {
  if (pathname === '/profile' || pathname.startsWith('/profile/')) {
    return true;
  }

  const editMatch = /^\/recipes\/[^/]+\/edit\/?$/.exec(pathname);
  return editMatch !== null;
}

/** Валидация относительного пути (защита от open redirect) */
export function safeNextPath(
  next: string | null | undefined,
  fallback = '/profile',
): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return fallback;
  }
  return next;
}

/** Текущий pathname из заголовка proxy */
export async function getCurrentPathname(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-pathname') ?? headersList.get('x-url') ?? '/';
}

/** Ссылка на логин с возвратом на текущую страницу */
export function buildLoginHref(pathname: string): string {
  if (pathname === '/login' || pathname === '/register') {
    return '/login';
  }

  const next = safeNextPath(pathname, '/profile');
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Куда редиректить после выхода */
export function resolveLogoutRedirect(pathname: string): string {
  const safe = safeNextPath(pathname, '/');

  if (!isProtectedPath(safe)) {
    return safe;
  }

  if (safe === '/profile' || safe.startsWith('/profile/')) {
    return '/login';
  }

  return `/login?next=${encodeURIComponent(safe)}`;
}
