import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/api";
import BackLink from "@/components/BackLink";
import TrackVisit from "@/components/TrackVisit";
import { Monitor, Smartphone, Apple, Sparkles, Navigation } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const tool = await getToolBySlug(slug);
    if (!tool) notFound();

    const title = tool.seoMetaTitle || tool.name;
    const description = tool.seoMetaDescription || tool.description;
    const url = `https://www.aiportalweekly.com/tools/${tool.slug}`;

    return {
        title: `${title} | AI Tools`,
        description: description,
        alternates: {
            canonical: tool.canonicalUrl || url,
        },
        openGraph: {
            title: tool.ogTitle || title,
            description: tool.ogDescription || description,
            url: url,
            type: 'website',
            images: tool.ogImage ? [{ url: tool.ogImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.twitterTitle || title,
            description: tool.twitterDescription || description,
            images: tool.twitterImage ? [tool.twitterImage] : (tool.ogImage ? [tool.ogImage] : []),
        },
    };
}

function getPlatformIcon(platform: string) {
    const p = platform.toLowerCase();
    if (p.includes('ios') || p.includes('apple') || p.includes('mac')) return <Apple className="w-4 h-4 mr-1.5" />;
    if (p.includes('android') || p.includes('mobile')) return <Smartphone className="w-4 h-4 mr-1.5" />;
    return <Monitor className="w-4 h-4 mr-1.5" />;
}

export default async function SingleToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const tool = await getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    const softwareAppJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        applicationCategory: tool.category?.name || 'MultimediaApplication',
        operatingSystem: tool.platforms?.join(', ') || 'Web',
        offers: {
            '@type': 'Offer',
            price: tool.startingPrice || (tool.pricing === 'free' ? '0' : 'Varies'),
            priceCurrency: 'USD',
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.aiportalweekly.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Tools',
                item: 'https://www.aiportalweekly.com/tools',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: tool.name,
                item: `https://www.aiportalweekly.com/tools/${tool.slug}`,
            },
        ],
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <TrackVisit slug={tool.slug} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ 
                    __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd]) 
                }}
            />

            <BackLink href="/tools" label="Catalog" />

            <article>
                <header className="mb-12 border-b-4 border-foreground pb-10">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight leading-none mb-8 text-foreground">
                        {tool.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase mb-6">
                        {tool.category && (
                            <span className="px-3 py-1.5 border border-border text-muted-foreground">
                                {tool.category.name}
                            </span>
                        )}
                        <span className="px-3 py-1.5 border border-foreground bg-foreground text-background flex items-center">
                            {tool.startingPrice || tool.pricing || "Free / Freemium"}
                        </span>
                        
                        {tool.platforms && tool.platforms.length > 0 && (
                            <div className="flex items-center gap-2">
                                {tool.platforms.map((platform: string) => (
                                    <span key={platform} className="flex items-center text-muted-foreground bg-secondary/10 px-3 py-1.5 rounded-sm">
                                        {getPlatformIcon(platform)}
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {tool.bestUsedFor && (
                        <div className="bg-secondary/5 border-l-4 border-secondary p-4 flex items-start gap-4 mb-4">
                            <Sparkles className="text-secondary w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-xs font-black tracking-widest uppercase border-b border-secondary/20 pb-2 mb-2">Ideal User & Best Used For</h3>
                                <p className="text-foreground/80 font-medium">{tool.bestUsedFor}</p>
                            </div>
                        </div>
                    )}
                </header>

                {tool.featuredImage && (
                    <div className="w-full aspect-video mb-12 border border-border overflow-hidden">
                        <img 
                            src={tool.featuredImage} 
                            alt={tool.featuredImageAlt || tool.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div 
                    className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-muted-foreground leading-loose"
                    dangerouslySetInnerHTML={{ __html: tool.description }}
                />

                {tool.website && (
                    <footer className="pt-10 border-t border-border flex justify-center">
                        <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border-2 border-transparent hover:border-foreground transition-all text-center w-full md:w-auto"
                        >
                            Navigate to {tool.name} <Navigation className="w-4 h-4" />
                        </a>
                    </footer>
                )}
            </article>
        </div>
    );
}
