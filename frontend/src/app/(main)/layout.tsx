import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicBackground from "@/components/DynamicBackground";
import PageTransition from "@/components/PageTransition";
import { getNews } from "@/lib/api";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch news data safely for the search bar (ignore errors during build)
  const newsResponse = await getNews(1, 100);
  const newsItems = newsResponse?.data || [];

  // Removed global max-width and horizontal padding to allow full-width mobile reels
  // Components that need constraints (like Home/Desktop News) must now apply them internally.
  return (
    <>
      <DynamicBackground />
      <Navbar newsItems={newsItems || []} />
      <main className="flex-grow z-10 relative w-full h-full pt-14 md:pt-16 pb-16 md:pb-0">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
