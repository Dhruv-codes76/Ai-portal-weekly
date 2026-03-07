import Link from "next/link";
import { notFound } from "next/navigation";

async function getTool(slug: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${slug}`;
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const tool = await getTool(params.slug);
    if (!tool) return { title: 'Not Found' };

    return {
        title: `${tool.seoMetaTitle || tool.name} | AI Tools`,
        description: tool.seoMetaDescription || tool.description,
    };
}

export default async function SingleToolPage({ params }: { params: { slug: string } }) {
    const tool = await getTool(params.slug);

    if (!tool) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href="/tools" className="inline-block text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground mb-12 transition-colors">
                &larr; Catalog
            </Link>

            <article>
                <header className="border-b-4 border-foreground pb-10 mb-12">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight leading-none mb-8 text-foreground">
                        {tool.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase">
                        {tool.category && (
                            <span className="px-3 py-1.5 border border-border text-muted-foreground">
                                {tool.category.name}
                            </span>
                        )}
                        <span className="px-3 py-1.5 border border-foreground text-foreground flex items-center">
                            Pricing: {tool.pricing || "Free / Freemium"}
                        </span>
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-16 whitespace-pre-wrap font-sans text-muted-foreground leading-loose">
                    {tool.description}
                </div>

                {tool.website && (
                    <footer className="pt-10 border-t border-border flex justify-center">
                        <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-10 py-5 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border-2 border-transparent hover:border-foreground transition-all text-center w-full md:w-auto"
                        >
                            Navigate to Website
                        </a>
                    </footer>
                )}
            </article>
        </div>
    );
}
