import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Аккаунт',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 py-12'>
      <div className='mb-8 flex items-center gap-2.5 text-[21px] font-extrabold text-foreground'>
        <Link href='/' className='flex items-center gap-2.5'>
          <div className='grid size-9 place-items-center rounded-[10px] bg-accent text-[21px] font-extrabold text-white'>
            i
          </div>
          <span>Ingredify</span>
        </Link>
      </div>

      <div className='w-full max-w-[400px] rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8'>
        {children}
      </div>
    </div>
  );
}
