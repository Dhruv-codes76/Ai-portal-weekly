import NewsCard from "@/components/NewsCard";

async function getNews() {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`;
    const res = await fetch(url, { next: { revalidate: 10 } }); // Revalidate every 10 seconds for MVP
    if (!res.ok) {
        console.error("Failed to fetch news:", res.status);
        return { data: [] };
    }
    return res.json();
}

export const metadata = {
    title: "Latest AI News | Editorial",
    description: "Read the latest beginner-friendly, unbiased AI news.",
};

export default async function NewsPage() {
    const { data: newsItems } = await getNews();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="border-b-4 border-foreground pb-6 mb-12">
                <h1 className="text-5xl font-sans font-bold tracking-tight mb-4">AI News Directory</h1>
                <p className="text-muted-foreground text-lg italic font-sans">The signal, cleanly separated from the noise.</p>
            </div>

            {newsItems && newsItems.length > 0 ? (
                <div className="flex flex-col">
                    {newsItems.map((item: any) => (
                        <NewsCard key={item._id} news={item} />
                    ))}
                </div>
            ) : (
                <div className="py-20 border border-dashed border-border text-center">
                    <h3 className="text-2xl font-sans text-muted-foreground italic">No transmissions available.</h3>
                </div>
            )}
        </div>
    );
}
