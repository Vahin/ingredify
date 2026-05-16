import { logout } from '../api/logout';
import { Button } from '@/shared/ui/button';

type LogoutButtonProps = {
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'xs';
};

export function LogoutButton({
  className,
  variant = 'outline',
  size = 'sm',
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <Button type='submit' variant={variant} size={size} className={className}>
        Выйти
      </Button>
    </form>
  );
}
