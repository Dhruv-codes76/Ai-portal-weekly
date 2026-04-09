"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Sparkles, Wand2, Loader2 } from "lucide-react";

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState("");
    const [aiTips, setAiTips] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        website: "",
        pricing: "free",
        startingPrice: "",
        bestUsedFor: "",
        platforms: "",
        status: "draft",
        seoMetaTitle: "",
        seoMetaDescription: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        featuredImage: "",
        featuredImageAlt: "",
        focusKeyphrase: "",
    });

    useEffect(() => {
        const fetchTool = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return router.push("/admin/login");

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch tools");

                const toolsArr = data.data || data || [];
                const tool = toolsArr.find((item: any) => String(item.id || item._id) === String(id));
                
                if (!tool) throw new Error("Tool not found");

                setFormData({
                    name: tool.name || "",
                    slug: tool.slug || "",
                    description: tool.description || "",
                    website: tool.website || "",
                    pricing: tool.pricing || "free",
                    startingPrice: tool.startingPrice || "",
                    bestUsedFor: tool.bestUsedFor || "",
                    platforms: Array.isArray(tool.platforms) ? tool.platforms.join(', ') : (tool.platforms || ""),
                    status: tool.status || "draft",
                    seoMetaTitle: tool.seoMetaTitle || "",
                    seoMetaDescription: tool.seoMetaDescription || "",
                    canonicalUrl: tool.canonicalUrl || "",
                    ogTitle: tool.ogTitle || "",
                    ogDescription: tool.ogDescription || "",
                    ogImage: tool.ogImage || "",
                    twitterTitle: tool.twitterTitle || "",
                    twitterDescription: tool.twitterDescription || "",
                    twitterImage: tool.twitterImage || "",
                    featuredImage: tool.featuredImage || "",
                    featuredImageAlt: tool.featuredImageAlt || "",
                    focusKeyphrase: tool.focusKeyphrase || "",
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setFetching(false);
            }
        };

        fetchTool();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            
            // Auto-generate logic
            if (name === "focusKeyphrase" && value) {
                newState.slug = value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                    .substring(0, 60);

                if (!prev.seoMetaTitle || prev.seoMetaTitle === prev.name) {
                    const titlePattern = `${value.charAt(0).toUpperCase() + value.slice(1)} | Best AI Tools | AI Portal`;
                    newState.seoMetaTitle = titlePattern.substring(0, 60);
                }

                if (!prev.seoMetaDescription || prev.seoMetaDescription === prev.description) {
                    const descPattern = `Discover ${value}. We've tested and reviewed ${value} to help you understand its real-world value and pricing.`;
                    newState.seoMetaDescription = descPattern.substring(0, 160);
                }
            } else if (name === "name" && !prev.focusKeyphrase && !newState.slug) {
                newState.slug = value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                    .substring(0, 60)
                    .replace(/-$/, '');
                
                if (!prev.seoMetaTitle) newState.seoMetaTitle = value.substring(0, 60);
            }
            
            return newState;
        });
    };

    const handleAutoSEO = async () => {
        if (!formData.description || formData.description.length < 50) {
            alert("Please add some description first so the AI can analyze it!");
            return;
        }

        setIsOptimizing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/seo/optimize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: formData.description,
                    title: formData.name,
                    focusKeyphrase: formData.focusKeyphrase,
                    type: "tool"
                }),
            });

            if (!response.ok) throw new Error("Failed to optimize SEO");

            const data = await response.json();
            
            setFormData(prev => ({
                ...prev,
                focusKeyphrase: data.focusKeyphrase,
                seoMetaTitle: data.seoMetaTitle,
                seoMetaDescription: data.seoMetaDescription,
                slug: data.slug,
                featuredImageAlt: data.featuredImageAlt || prev.featuredImageAlt
            }));
            
            if (data.improvementTips && Array.isArray(data.improvementTips)) {
                setAiTips(data.improvementTips);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to reach the SEO Magic engine.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    platforms: formData.platforms ? formData.platforms.split(',').map(s => s.trim()).filter(Boolean) : []
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to edit tool");

            router.push("/admin/tools");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-4xl mx-auto min-h-[50vh] flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="tracking-widest uppercase font-bold text-sm">Loading Tool Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/admin/tools" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    &larr; Back to Tool Catalog Management
                </Link>
            </div>

            <h1 className="text-4xl font-sans font-bold tracking-tight mb-8">Edit Tool</h1>

            {error && (
                <div className="mb-8 p-4 border border-red-500 text-red-500 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Section 1: Core Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">1</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Core Content</h2>
                    </div>

                    {/* Tool Name FIRST */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Tool Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors text-2xl font-bold placeholder:opacity-30"
                            placeholder="Enter the name of the AI tool..."
                        />
                    </div>

                    {/* Focus Keyphrase SECOND */}
                    <div className="bg-secondary/5 border-2 border-secondary/20 p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground block">Focus Keyphrase (The SEO Driver)</label>
                            <input
                                required
                                type="text"
                                name="focusKeyphrase"
                                value={formData.focusKeyphrase}
                                onChange={handleChange}
                                className="w-full p-4 bg-background border-2 border-secondary/30 focus:border-secondary focus:outline-none transition-colors text-lg font-bold placeholder:opacity-30"
                                placeholder="e.g. chatgpt 4o review"
                            />
                            <p className="text-[10px] text-muted-foreground italic leading-tight">
                                Auto-generates your URL slug, SEO title, and meta description.
                            </p>
                        </div>
                    </div>

                    <FeaturedImagePortal 
                        imageUrl={formData.featuredImage}
                        imageAlt={formData.featuredImageAlt}
                        onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Website URL</label>
                        <input
                            required
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="https://"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Best Used For</label>
                        <input
                            type="text"
                            name="bestUsedFor"
                            value={formData.bestUsedFor}
                            onChange={handleChange}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="e.g. Content Creators, Developers"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Starting Price</label>
                            <input
                                type="text"
                                name="startingPrice"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors"
                                placeholder="e.g. $9.99/mo or Free"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Platforms</label>
                            <input
                                type="text"
                                name="platforms"
                                value={formData.platforms}
                                onChange={handleChange}
                                className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors"
                                placeholder="Web, iOS, Android (comma separated)"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block mb-2">Description / Review</label>
                        <RichTextEditor 
                            content={formData.description}
                            onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                            placeholder="Describe the tool, its features, and your verdict..."
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAutoSEO}
                        disabled={isOptimizing}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-white text-sm font-black uppercase tracking-widest hover:bg-secondary/80 transition-all rounded-lg shadow-lg disabled:opacity-50"
                    >
                        <Wand2 className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
                        {isOptimizing ? "Generating SEO magic..." : "✨ Generate SEO (Auto-fills everything below)"}
                    </button>

                    {aiTips.length > 0 && (
                        <div className="bg-secondary/5 border-2 border-secondary/20 p-5 shadow-sm rounded-xl mt-6">
                            <h4 className="text-[10px] font-black tracking-widest uppercase text-secondary mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                How to Improve This Tool Description
                            </h4>
                            <ul className="space-y-3">
                                {aiTips.map((tip, idx) => (
                                    <li key={idx} className="text-sm font-medium text-foreground/80 leading-snug flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-2">
                        <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">2</div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Generated & Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">URL Slug <span className="text-[10px] text-muted-foreground font-normal normal-case">(editable)</span></label>
                            <input
                                required
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Pricing Model</label>
                            <select
                                name="pricing"
                                value={formData.pricing}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm"
                            >
                                <option value="free" className="bg-background">Free</option>
                                <option value="freemium" className="bg-background">Freemium</option>
                                <option value="paid" className="bg-background">Paid</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-widest uppercase block">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors uppercase tracking-widest text-sm"
                            >
                                <option value="draft" className="bg-background">Draft</option>
                                <option value="published" className="bg-background">Published</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-border">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-bold font-sans">3</div>
                            <h2 className="text-xl font-bold uppercase tracking-widest">Search & Social (SEO)</h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutoSEO}
                            disabled={isOptimizing}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-all rounded shadow-lg disabled:opacity-50"
                        >
                            <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                            {isOptimizing ? "Generating..." : "✨ Magic Auto-SEO"}
                        </button>
                    </div>

                    <SEOEditor 
                        data={formData} 
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        baseSlug={formData.slug}
                        type="tool"
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-50 flex justify-center md:justify-end md:px-12">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border border-foreground transition-all disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Tool"}
                    </button>
                </div>
            </form>
        </div>
    );
}
