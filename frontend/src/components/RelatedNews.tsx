import Link from "next/link";
import { getRelatedNews } from "@/lib/api";

interface RelatedNewsProps {
    currentSlug: string;
}

export default async function RelatedNews({ currentSlug }: RelatedNewsProps) {
    const relatedArticles = await getRelatedNews(currentSlug);

    if (!relatedArticles || relatedArticles.length === 0) {
        return null; // Don't render anything if no related articles are found
    }

    return (
        <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Intelligence</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((article: any) => {
                    const date = new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                    });

                    return (
                        <Link 
                            key={article.slug} 
                            href={`/news/${article.slug}`}
                            className="group block rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors overflow-hidden flex flex-col h-full"
                        >
                            {article.featuredImage && (
                                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                                    <img 
                                        src={article.featuredImage} 
                                        alt={article.featuredImageAlt || article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <time className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                                    {date}
                                </time>
                                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-indigo-400 transition-colors line-clamp-3">
                                    {article.title}
                                </h3>
                                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-indigo-400">
                                    Read Brief <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
