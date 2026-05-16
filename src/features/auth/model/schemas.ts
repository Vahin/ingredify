import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя должно быть не короче 2 символов.'),
  email: z.string().trim().email('Введите корректный email.'),
  password: z
    .string()
    .min(8, 'Пароль должен быть не короче 8 символов.'),
});

export const LoginSchema = z.object({
  email: z.string().trim().email('Введите корректный email.'),
  password: z.string().min(1, 'Введите пароль.'),
});

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    form?: string[];
  };
  message?: string;
} | null;
