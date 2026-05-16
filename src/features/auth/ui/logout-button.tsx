import { logout } from '../api/logout';
import { Button } from '@/shared/ui/button';

type LogoutButtonProps = {
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'xs';
  /** Куда вернуться после выхода (по умолчанию — /login на защищённых страницах) */
  next?: string;
};

export function LogoutButton({
  className,
  variant = 'outline',
  size = 'sm',
  next = '/login',
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <input type='hidden' name='next' value={next} />
      <Button type='submit' variant={variant} size={size} className={className}>
        Выйти
      </Button>
    </form>
  );
}
