import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface ToolItem {
    _id: string;
    name: string;
    slug: string;
    description: string;
    pricing: string;
    category?: Category;
}

export default function ToolCard({ tool }: { tool: ToolItem }) {
    return (
        <Link href={`/tools/${tool.slug}`} className="block group h-full">
            <article className="h-full border border-border p-6 flex flex-col transition-colors hover:bg-muted/30">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-sans text-2xl font-bold group-hover:underline decoration-1 underline-offset-4 line-clamp-1">
                        {tool.name}
                    </h3>
                    {tool.category && (
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-2 py-1">
                            {tool.category.name}
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground flex-grow line-clamp-4 leading-relaxed mb-6">
                    {tool.description}
                </p>

                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-xs tracking-wide">
                    <span className="uppercase text-muted-foreground font-medium">Pricing</span>
                    <span className="capitalize">{tool.pricing || "Free / Freemium"}</span>
                </div>
            </article>
        </Link>
    );
}
