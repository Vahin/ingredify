import { HeaderAuthActions } from './header-auth-actions/header-auth-actions';
import { Search } from '@/features/search';
import { Logo } from '@/shared/ui/logo/logo';

export async function Header() {
  return (
    <header className='sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-[14px]'>
      <div className='mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 md:grid-cols-[190px_minmax(280px,1fr)_auto] md:gap-6 md:px-6 md:py-4'>
        <Logo />
        <Search />
        <HeaderAuthActions />
      </div>
    </header>
  );
}
