'use server';

import { redirect } from 'next/navigation';
import {
  clearSessionCookie,
  deleteSession,
  getSessionIdFromCookie,
} from '@/shared/lib/auth';

export async function logout(): Promise<void> {
  const sessionId = await getSessionIdFromCookie();
  if (sessionId) {
    await deleteSession(sessionId);
  }
  await clearSessionCookie();
  redirect('/login');
}
