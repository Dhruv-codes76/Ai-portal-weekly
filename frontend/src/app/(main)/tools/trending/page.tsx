import Link from "next/link";
import { getTools } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Flame, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
    title: "Trending AI Tools | Top Rated AI Products",
    description: "Discover the hottest and most popular AI tools trending right now.",
};

export default async function TrendingToolsPage() {
    // Fetch top 20 trending tools
    const response = await getTools(1, 20, '', 'trending');
    const tools = response?.data || [];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <PageHeader 
                title={
                    <span className="flex items-center gap-4">
                        <Flame className="w-10 h-10 md:w-16 md:h-16 text-orange-500" />
                        Trending Tools
                    </span>
                }
                subtitle="The most popular AI utilities shaping the industry today." 
            />

            {tools && tools.length > 0 ? (
                <div className="space-y-6 mt-12">
                    {tools.map((tool: any, index: number) => (
                        <div key={tool.id} className="group relative flex flex-col md:flex-row gap-6 p-6 border-2 border-border bg-background hover:border-foreground transition-all duration-300 items-center md:items-stretch">
                            
                            {/* Rank Badge */}
                            <div className="absolute -left-4 -top-4 w-10 h-10 bg-foreground text-background font-black flex items-center justify-center rounded-sm z-10 shadow-lg border-2 border-background">
                                #{index + 1}
                            </div>

                            {/* Image Placeholder or Logo */}
                            {tool.featuredImage ? (
                                <img 
                                    src={tool.featuredImage} 
                                    alt={tool.featuredImageAlt || tool.name} 
                                    className="w-full md:w-48 h-32 object-cover object-center shrink-0 border border-border"
                                />
                            ) : (
                                <div className="w-full md:w-48 h-32 bg-secondary/10 flex items-center justify-center shrink-0 border border-border">
                                    <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">{tool.name.substring(0, 2)}</span>
                                </div>
                            )}

                            {/* Tool Info */}
                            <div className="flex-1 flex flex-col w-full">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground group-hover:text-secondary transition-colors">
                                        <Link href={`/tools/${tool.slug}`} className="before:absolute before:inset-0">
                                            {tool.name}
                                        </Link>
                                    </h2>
                                    {tool.pricing && (
                                        <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase">
                                            {tool.pricing}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-4">
                                    {tool.seoMetaDescription || tool.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                        Read Review <ArrowRight className="w-3 h-3" />
                                    </div>

                                    {tool.category && (
                                        <span className="text-[10px] tracking-widest font-bold uppercase border border-border px-2 py-1 text-muted-foreground">
                                            {tool.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message="No trending tools found." />
            )}
        </div>
    );
}
