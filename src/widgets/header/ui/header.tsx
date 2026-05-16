import Link from 'next/link';
import { IconOld } from '@/shared/ui/icon';
import { getCurrentUser } from '@/entities/user';
import { logout } from '@/features/auth';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 1).toUpperCase();
  }
  return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
}

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className='sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-[14px]'>
      <div className='mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 md:grid-cols-[190px_minmax(280px,1fr)_auto] md:gap-6 md:px-6 md:py-4'>
        <div className='flex min-w-0 items-center gap-2.5 text-[19px] font-extrabold text-foreground md:text-[21px]'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='grid size-9 place-items-center rounded-[10px] bg-accent text-[21px] font-extrabold text-white'>
              i
            </div>
            <span>Ingredify</span>
          </Link>
        </div>

        <label className='relative order-3 col-span-full min-w-0 md:order-none md:col-auto'>
          <span className='sr-only'>Поиск рецепта</span>
          <IconOld
            name='search'
            className='pointer-events-none absolute left-[18px] top-1/2 size-[18px] -translate-y-1/2 text-secondary'
          />
          <input
            className='h-11 w-full rounded-full border-0 bg-muted px-5 pl-12 text-sm text-foreground outline outline-1 outline-transparent transition-[background-color,outline-color] placeholder:text-secondary focus:bg-card focus:outline-accent/45'
            placeholder='Найти рецепт, ингредиент или кухню'
            type='search'
          />
        </label>

        <div className='flex items-center justify-end gap-2'>
          {user ? (
            <>
              <Link
                href='/profile'
                aria-label='Открыть профиль'
                className={cn(
                  'grid size-[38px] place-items-center rounded-full bg-accent text-sm font-extrabold text-white',
                  'shadow-[0_0_0_5px_color-mix(in_oklch,var(--accent)_12%,transparent)]',
                )}
              >
                {getInitials(user.name)}
              </Link>
              <form action={logout}>
                <Button type='submit' variant='ghost' size='sm'>
                  Выйти
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/login'>Войти</Link>
              </Button>
              <Button asChild size='sm'>
                <Link href='/register'>Регистрация</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
