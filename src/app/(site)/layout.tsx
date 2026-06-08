import { Header } from '@/widgets/header';
import { getCart } from '@/entities/cart/api/get-cart';
import { CartProvider } from '@/entities/cart';
import { getCurrentUser } from '@/entities/user';
import { Toaster } from '@/shared/ui/sonner';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const initialCart = user ? await getCart() : undefined;

  return (
    <CartProvider
      initialCart={initialCart}
      isAuthenticated={Boolean(user)}
    >
      <div className='min-h-screen bg-background pb-14'>
        <Header />
        {children}
      </div>
      <Toaster position='bottom-right' richColors />
    </CartProvider>
  );
}
