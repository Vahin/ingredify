'use server';

import { redirect } from 'next/navigation';
import {
  clearSessionCookie,
  deleteSession,
  getSessionIdFromCookie,
  resolveLogoutRedirect,
} from '@/shared/lib/auth';

export async function logout(formData: FormData): Promise<void> {
  const sessionId = await getSessionIdFromCookie();
  if (sessionId) {
    await deleteSession(sessionId);
  }
  await clearSessionCookie();

  const next = formData.get('next')?.toString() ?? null;
  redirect(resolveLogoutRedirect(next ?? '/'));
}
