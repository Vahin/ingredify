import { getCurrentUser } from '@/entities/user';
import { UserMenuButton } from '@/features/show-user-menu';
import { buildLoginHref, getCurrentPathname } from '@/shared/lib/auth';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export const HeaderAuthActions = async () => {
  const user = await getCurrentUser();
  const pathname = await getCurrentPathname();
  const loginHref = buildLoginHref(pathname);

  return (
    <div className='flex items-center justify-end gap-2'>
      {user ? (
        <>
          <UserMenuButton user={user} />
        </>
      ) : (
        <>
          <Button asChild variant='ghost' size='sm'>
            <Link href={loginHref}>Войти</Link>
          </Button>
          <Button asChild size='sm'>
            <Link href='/register'>Регистрация</Link>
          </Button>
        </>
      )}
    </div>
  );
};
