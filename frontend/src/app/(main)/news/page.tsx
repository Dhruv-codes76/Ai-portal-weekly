import MobileReelsView from "@/components/MobileReelsView";
import DesktopNewsList from "@/components/DesktopNewsList";
import IndiaHubSection from "@/components/IndiaHubSection";
import { getNews } from "@/lib/api";
import { isRequestFromIndia } from "@/lib/geo";
import { Suspense } from "react";

export const metadata = {
    title: "AI Intel Briefs for Tech Freshers",
    description: "Honest, blunt, and short AI news briefs specifically for students entering the tech market. No fluff, just real intelligence.",
};

// Ensure page is always dynamic (no stale caching)
export const revalidate = 0;

export default async function NewsPage() {
    // 1. Determine User Region
    const isIndia = await isRequestFromIndia();

    // 2. Fetch Data (Global News + India Blogs if applicable)
    // Run both queries in parallel if we are in India
    const [newsData, indiaBlogsData] = await Promise.all([
        getNews(1, 12, 'GLOBAL', 'NEWS'),
        isIndia ? getNews(1, 6, 'INDIA', 'BLOG') : Promise.resolve({ data: [] })
    ]);

    const newsItems = newsData?.data || [];
    const indiaBlogs = indiaBlogsData?.data || [];

    return (
        <div className="pb-16">
            {/* Conditional India-Only Blog Section */}
            {isIndia && (
                <IndiaHubSection blogs={indiaBlogs} />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
                <h2 className="text-2xl font-bold font-sans tracking-tight mb-2">Global AI Intelligence</h2>
                <p className="text-sm text-muted-foreground">The blunt truth about the AI moves that matter.</p>
            </div>

            {/* Mobile View (< 768px) */}
            <div className="block md:hidden">
                <Suspense fallback={<div className="w-full h-screen bg-black flex items-center justify-center animate-pulse"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>}>
                    <MobileReelsView newsItems={newsItems} />
                </Suspense>
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block">
                <Suspense fallback={<div className="max-w-[900px] mx-auto py-12 px-6 flex flex-col gap-10"><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div></div>}>
                    <DesktopNewsList newsItems={newsItems} />
                </Suspense>
            </div>
        </div>
    );
}

