import Link from "next/link";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
    const date = new Date(news.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="group border-b border-border py-8 first:pt-0 last:border-0 transition-colors hover:bg-muted/10">
            <Link href={`/news/${news.slug}`} className="block h-full">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3">
                    <h3 className="font-sans text-2xl font-bold text-foreground group-hover:underline decoration-1 underline-offset-4 mb-2 md:mb-0 md:mr-6 line-clamp-2 md:line-clamp-none">
                        {news.title}
                    </h3>
                    <time className="text-xs tracking-wide text-muted-foreground whitespace-nowrap uppercase font-medium mt-1 md:mt-0">
                        {date}
                    </time>
                </div>

                <p className="text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-2 max-w-4xl">
                    {news.summary}
                </p>
            </Link>
        </article>
    );
}
