import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FloatingButtons } from '@/components/layout/floating-buttons';
import { PromoPopup } from '@/components/ui/promo-popup';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
      <PromoPopup />
    </div>
  );
}
