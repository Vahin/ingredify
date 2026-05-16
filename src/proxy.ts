import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/shared/lib/auth';

function isProtectedPath(pathname: string): boolean {
  if (pathname === '/profile' || pathname.startsWith('/profile/')) {
    return true;
  }

  const editMatch = /^\/recipes\/[^/]+\/edit\/?$/.exec(pathname);
  return editMatch !== null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  if (isProtectedPath(pathname)) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/profile', '/profile/:path*', '/recipes/:recipeId/edit'],
};
