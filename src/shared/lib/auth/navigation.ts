import { isProtectedPath } from './protected-path';

export { isProtectedPath };

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
