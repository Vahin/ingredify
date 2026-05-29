import { headers } from 'next/headers';

/** Текущий pathname из заголовка proxy */
export async function getCurrentPathname(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-pathname') ?? headersList.get('x-url') ?? '/';
}
