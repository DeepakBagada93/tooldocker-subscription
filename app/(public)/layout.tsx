import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { getCategories } from '@/app/actions/products';
import { PublicLayoutEnhancements } from '@/components/layout/public-layout-enhancements';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col relative">
      <AnnouncementBar />
      <Header initialCategories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <PublicLayoutEnhancements />
    </div>
  );
}
