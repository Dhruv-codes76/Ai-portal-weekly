import MobileReelsView from "@/components/MobileReelsView";
import DesktopNewsList from "@/components/DesktopNewsList";
import { getNews } from "@/lib/api";

export const metadata = {
    title: "Latest AI News | Editorial",
    description: "Read the latest beginner-friendly, unbiased AI news.",
};

// Ensure page is always dynamic (no stale caching)
export const revalidate = 0;

export default async function NewsPage() {
    const { data: newsItems } = await getNews();

    return (
        <>
            {/* Mobile View (< 768px) */}
            <div className="block md:hidden">
                <MobileReelsView newsItems={newsItems || []} />
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block">
                <DesktopNewsList newsItems={newsItems || []} />
            </div>
        </>
    );
}
