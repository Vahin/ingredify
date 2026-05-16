'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from '@/shared/lib/auth';
import { LoginSchema, type AuthFormState } from '../model/schemas';

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/profile';
  }
  return next;
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return {
      errors: {
        form: ['Неверный email или пароль.'],
      },
    };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return {
      errors: {
        form: ['Неверный email или пароль.'],
      },
    };
  }

  const sessionId = await createSession(user.id);
  await setSessionCookie(sessionId);

  const next = safeNextPath(formData.get('next')?.toString() ?? null);
  redirect(next);
}
