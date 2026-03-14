"use client";

import { useState, useEffect } from "react";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Sparkles, Save, Eye } from "lucide-react";

export interface NewsFormData {
    title: string;
    slug: string;
    summary: string;
    content: string;
    sourceLink: string;
    status: string;
    seoMetaTitle: string;
    seoMetaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    featuredImage: string;
    featuredImageAlt: string;
}

interface NewsEditorProps {
    initialData: NewsFormData;
    onSubmit: (data: NewsFormData) => void;
    loading: boolean;
    isEdit?: boolean;
}

export default function NewsEditor({ initialData, onSubmit, loading, isEdit = false }: NewsEditorProps) {
    const [formData, setFormData] = useState<NewsFormData>(initialData);
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title" && !formData.slug && !isEdit) {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleAutoFillSEO = () => {
        setFormData(prev => ({
            ...prev,
            seoMetaTitle: prev.title,
            seoMetaDescription: prev.summary,
            ogTitle: prev.title,
            ogDescription: prev.summary,
            ogImage: prev.featuredImage,
            twitterTitle: prev.title,
            twitterDescription: prev.summary,
            twitterImage: prev.featuredImage
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const PreviewPane = () => (
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {formData.featuredImage ? (
                <div className="w-full aspect-video mb-6 border border-border overflow-hidden">
                    <img 
                        src={formData.featuredImage} 
                        alt={formData.featuredImageAlt || formData.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full aspect-video mb-6 border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted/10">
                    No Featured Image Selected
                </div>
            )}
            
            <header className="border-b-4 border-foreground pb-4 mb-6">
                <h1 className="text-2xl md:text-4xl font-sans font-bold tracking-tight leading-none mb-4 text-foreground">
                    {formData.title || "Your Headline Will Appear Here"}
                </h1>
                <div className="flex items-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    <time>{dateStr}</time>
                    <span className="mx-2">&mdash;</span>
                    <span>Intelligence Brief</span>
                </div>
            </header>

            <p className="text-lg font-sans text-muted-foreground italic mb-8 leading-relaxed">
                {formData.summary || "Your summary/lead paragraph will appear here."}
            </p>

            {formData.content ? (
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            ) : (
                <p className="text-muted-foreground border-l-2 border-muted pl-4 italic">Start writing your content to see it previewed here.</p>
            )}
        </article>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 relative">
            {/* Mobile Tab Controls */}
            <div className="flex lg:hidden w-full border-b border-border sticky top-0 bg-background z-20">
                <button 
                    type="button" 
                    onClick={() => setActiveTab("write")}
                    className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "write" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
                >
                    Edit Mode
                </button>
                <button 
                    type="button" 
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "preview" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
                >
                    Live Preview
                </button>
            </div>

            {/* Left side: Editor Form */}
            <div className={`flex-1 space-y-12 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                {/* Section 1: Core Information */}
                <section className="space-y-6 pt-2">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">1</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Core Information</h2>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Headline</label>
                        <p className="text-xs text-muted-foreground">The main title of your article. Keep it catchy and relevant.</p>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors text-lg font-medium"
                            placeholder="e.g. New Advancements in AI Technology"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Summary (Lead Paragraph)</label>
                        <p className="text-xs text-muted-foreground">A brief overview of the article. This appears on the news feed and below the title.</p>
                        <textarea
                            required
                            name="summary"
                            rows={3}
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors resize-y text-base"
                            placeholder="Briefly summarize the key points..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block mb-2">Full Content</label>
                        <p className="text-xs text-muted-foreground mb-3">Write the full article here. Use the toolbar to add formatting, lists, or links.</p>
                        <RichTextEditor 
                            content={formData.content}
                            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                            placeholder="Start writing your intelligence brief here..."
                        />
                    </div>
                </section>

                {/* Section 2: Media & Configuration */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">2</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Media & Config</h2>
                    </div>

                    <div className="bg-muted/10 p-6 border border-border">
                        <h3 className="text-sm font-bold tracking-widest uppercase block mb-2">Featured Image</h3>
                        <p className="text-xs text-muted-foreground mb-4">This image represents your post on the site and social media. Currently using standard URL inputs. Cloud upload coming soon.</p>
                        <FeaturedImagePortal 
                            imageUrl={formData.featuredImage}
                            imageAlt={formData.featuredImageAlt}
                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">URL Slug</label>
                            <p className="text-xs text-muted-foreground">The web address part (e.g. your-title). Auto-generated if left blank.</p>
                            <input
                                required
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Status</label>
                            <p className="text-xs text-muted-foreground">Publish right away or save as a draft to edit later.</p>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm font-bold"
                            >
                                <option value="draft" className="bg-background text-yellow-500">Draft (Invisible)</option>
                                <option value="published" className="bg-background text-green-500">Published (Live)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Section 3: SEO Magic */}
                <section className="space-y-6 pb-20 lg:pb-0">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">3</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Search & Social (SEO)</h2>
                    </div>

                    <div className="bg-secondary/10 border border-secondary p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="font-bold uppercase tracking-widest text-sm text-secondary">Magic SEO Generator</h3>
                                <p className="text-xs text-muted-foreground mt-1">Don&apos;t want to type SEO fields manually? Let the system auto-fill them based on your Headline and Summary.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAutoFillSEO}
                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-secondary/80 transition-colors shrink-0"
                            >
                                <Sparkles className="w-4 h-4" />
                                Auto-Fill SEO
                            </button>
                        </div>
                    </div>

                    <SEOEditor 
                        data={formData} 
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        baseSlug={formData.slug}
                        type="news"
                    />
                </section>
            </div>

            {/* Right side: Live Preview (Sticky) */}
            <div className={`flex-1 lg:w-[45%] lg:max-w-2xl shrink-0 ${activeTab === 'write' ? 'hidden lg:block' : 'block'}`}>
                <div className="lg:sticky lg:top-8 border border-border bg-background shadow-lg h-[calc(100vh-8rem)] min-h-[600px] flex flex-col">
                    <div className="border-b border-border bg-muted/20 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground pl-2">
                            <Eye className="w-4 h-4" /> Live Preview
                        </div>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                    </div>
                    <div className="p-6 md:p-10 overflow-y-auto flex-1 bg-white dark:bg-zinc-950">
                        <div className="max-w-[65ch] mx-auto">
                            <PreviewPane />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-50 flex justify-center lg:justify-end lg:px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-4 w-full max-w-7xl mx-auto justify-between lg:justify-end">
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground hidden md:block">
                        Status: <span className={formData.status === 'published' ? 'text-green-500' : 'text-yellow-500'}>{formData.status}</span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border border-foreground transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : (isEdit ? "Save Changes" : "Publish Article")}
                    </button>
                </div>
            </div>
        </form>
    );
}
