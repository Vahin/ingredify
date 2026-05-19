import { getInitials } from '@/shared/lib/helpers';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { CurrentUser } from '@/shared/lib/auth/dal';

export const UserMenuButton = ({ user }: { user: CurrentUser }) => {
  return (
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
  );
};
