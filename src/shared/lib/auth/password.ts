import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/** Хеширование пароля перед сохранением в БД */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Проверка пароля при входе */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
