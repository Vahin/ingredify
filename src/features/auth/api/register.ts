'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import {
  createSession,
  hashPassword,
  setSessionCookie,
} from '@/shared/lib/auth';
import { RegisterSchema, type AuthFormState } from '../model/schemas';

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      errors: {
        email: ['Пользователь с таким email уже зарегистрирован.'],
      },
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: { id: true },
  });

  const sessionId = await createSession(user.id);
  await setSessionCookie(sessionId);

  redirect('/profile');
}
