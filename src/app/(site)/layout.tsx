import { Header } from '@/widgets/header';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen bg-background pb-14'>
      <Header />
      {children}
    </div>
  );
}
