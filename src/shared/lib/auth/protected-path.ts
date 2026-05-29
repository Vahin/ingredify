/** Защищённые маршруты — без сессии недоступны */
export function isProtectedPath(pathname: string): boolean {
  if (pathname === '/profile' || pathname.startsWith('/profile/')) {
    return true;
  }

  const editMatch = /^\/recipes\/[^/]+\/edit\/?$/.exec(pathname);
  return editMatch !== null;
}
