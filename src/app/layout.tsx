import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/shared/lib/utils';
import { Header } from '@/widgets/header';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ingredify',
    template: '%s | Ingredify',
  },
  description: 'Приватная база рецептов и кулинарных заметок.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ru'
      className={cn(
        'h-full',
        'bg-background',
        'antialiased',
        inter.variable,
        'font-sans',
        geist.variable,
      )}
    >
      <body className='min-h-full bg-background font-sans text-foreground'>
        <div className='min-h-screen bg-background pb-14'>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
