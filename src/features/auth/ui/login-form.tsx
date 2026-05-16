'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/shared/ui/button';
import { login } from '../api/login';
import { AuthField } from './auth-field';

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className='flex w-full flex-col gap-4'>
      {next ? <input type='hidden' name='next' value={next} /> : null}

      {state?.errors?.form ? (
        <p className='rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          {state.errors.form[0]}
        </p>
      ) : null}

      <AuthField
        id='email'
        label='Email'
        name='email'
        type='email'
        autoComplete='email'
        errors={state?.errors?.email}
      />
      <AuthField
        id='password'
        label='Пароль'
        name='password'
        type='password'
        autoComplete='current-password'
        errors={state?.errors?.password}
      />

      <Button type='submit' className='mt-2 h-11 w-full' disabled={pending}>
        {pending ? 'Вход…' : 'Войти'}
      </Button>

      <p className='text-center text-sm text-secondary'>
        Нет аккаунта?{' '}
        <Link href='/register' className='font-medium text-accent hover:underline'>
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
