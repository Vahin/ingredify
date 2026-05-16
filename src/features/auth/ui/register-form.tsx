'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/shared/ui/button';
import { register } from '../api/register';
import { AuthField } from './auth-field';

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <form action={formAction} className='flex w-full flex-col gap-4'>
      <AuthField
        id='name'
        label='Имя'
        name='name'
        autoComplete='name'
        errors={state?.errors?.name}
      />
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
        autoComplete='new-password'
        errors={state?.errors?.password}
      />

      <Button type='submit' className='mt-2 h-11 w-full' disabled={pending}>
        {pending ? 'Регистрация…' : 'Создать аккаунт'}
      </Button>

      <p className='text-center text-sm text-secondary'>
        Уже есть аккаунт?{' '}
        <Link href='/login' className='font-medium text-accent hover:underline'>
          Войти
        </Link>
      </p>
    </form>
  );
}
