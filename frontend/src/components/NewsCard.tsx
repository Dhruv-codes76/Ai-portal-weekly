import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
    image_url?: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    const date = new Date(news.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <article className="group flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-foreground/20">
            <Link href={`/news/${news.slug}`} className="flex flex-col h-full">
                {/* Image Placeholder Container (16:9) with Zoom on Hover */}
                <div className="relative w-full pt-[56.25%] bg-muted flex items-center justify-center overflow-hidden">
                    {news.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={news.image_url}
                            alt={news.title}
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted/50 transition-transform duration-700 group-hover:scale-105">
                            <ImageIcon className="w-10 h-10" />
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-6 lg:p-8">
                    <time className="text-xs tracking-wider text-muted-foreground uppercase font-semibold mb-3">
                        {date}
                    </time>
                    <h3 className="font-sans text-xl lg:text-2xl font-bold text-card-foreground leading-snug mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto font-medium">
                        {news.summary}
                    </p>
                </div>
            </Link>
        </article>
    );
}
