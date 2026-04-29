"use client";

import { useState, useEffect } from "react";
import { experimental_useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });
import { Sparkles, Wand2 } from "lucide-react";

export default function CreateToolPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState("");
    const [aiTips, setAiTips] = useState<string[]>([]);
    const [scrapeUrl, setScrapeUrl] = useState("");
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

    const { submit: submitScrape, isLoading: isScraping, object: streamObject } = experimental_useObject({
        api: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/scrape-stream`,
        fetch: async (input, init) => {
            const token = localStorage.getItem("adminToken");
            return fetch(input, {
                ...init,
                headers: {
                    ...(init?.headers || {}),
                    "Authorization": `Bearer ${token}`
                }
            });
        },
        schema: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            focusKeyphrase: z.string().optional(),
            seoMetaTitle: z.string().optional(),
            seoMetaDescription: z.string().optional(),
            featuredImageAlt: z.string().optional(),
            bestUsedFor: z.string().optional(),
            startingPrice: z.string().optional(),
            pricing: z.enum(['free', 'freemium', 'paid']).optional(),
            platforms: z.string().optional()
        }),
        onFinish({ object }) {
            if (object) {
                setFormData(prev => ({
                    ...prev,
                    name: object.name || prev.name,
                    description: object.description || prev.description,
                    focusKeyphrase: object.focusKeyphrase || prev.focusKeyphrase,
                    website: scrapeUrl || prev.website,
                    seoMetaTitle: object.seoMetaTitle || prev.seoMetaTitle,
                    seoMetaDescription: object.seoMetaDescription || prev.seoMetaDescription,
                    featuredImageAlt: object.featuredImageAlt || prev.featuredImageAlt,
                    bestUsedFor: object.bestUsedFor || prev.bestUsedFor,
                    startingPrice: object.startingPrice || prev.startingPrice,
                    pricing: object.pricing || prev.pricing,
                    platforms: object.platforms || prev.platforms
                }));
            }
        },
        onError(err) {
            console.error("Streaming error:", err);
            setError("Streaming failed.");
        }
    });

    const startStreaming = () => {
        if (!scrapeUrl) return;
        submitScrape({ url: scrapeUrl });
    };

    useEffect(() => {
        if (isScraping && streamObject) {
             setFormData(prev => ({
                 ...prev,
                 ...(streamObject.name && { name: streamObject.name }),
                 ...(streamObject.description && { description: streamObject.description }),
                 ...(streamObject.focusKeyphrase && { focusKeyphrase: streamObject.focusKeyphrase }),
                 ...(streamObject.seoMetaTitle && { seoMetaTitle: streamObject.seoMetaTitle }),
                 ...(streamObject.seoMetaDescription && { seoMetaDescription: streamObject.seoMetaDescription }),
                 ...(streamObject.featuredImageAlt && { featuredImageAlt: streamObject.featuredImageAlt }),
                 ...(streamObject.bestUsedFor && { bestUsedFor: streamObject.bestUsedFor }),
                 ...(streamObject.startingPrice && { startingPrice: streamObject.startingPrice }),
                 ...(streamObject.pricing && { pricing: streamObject.pricing }),
                 ...(streamObject.platforms && { platforms: streamObject.platforms })
             }));
        }
    }, [isScraping, streamObject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            
            // Auto-generate logic
            if (name === "focusKeyphrase" && value) {
                // 1. Slug from keyphrase
                newState.slug = value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                    .substring(0, 60);

                // 2. SEO Title from keyphrase
                if (!prev.seoMetaTitle || prev.seoMetaTitle === prev.name) {
                    const titlePattern = `${value.charAt(0).toUpperCase() + value.slice(1)} | Best AI Tools | AI Portal`;
                    newState.seoMetaTitle = titlePattern.substring(0, 60);
                }

                // 3. Meta Description (Start with keyphrase)
                if (!prev.seoMetaDescription || prev.seoMetaDescription === prev.description) {
                    const descPattern = `Discover ${value}. We've tested and reviewed ${value} to help you understand its real-world value and pricing.`;
                    newState.seoMetaDescription = descPattern.substring(0, 160);
                }
            } else if (name === "name" && !prev.focusKeyphrase && !newState.slug) {
                // Fallback to name if no focus keyphrase, keep it under 60 chars
                newState.slug = value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                    .substring(0, 60)
                    .replace(/-$/, '');
                
                if (!prev.seoMetaTitle) newState.seoMetaTitle = value.substring(0, 60);
            }
            
            return newState;
        });
    };    const handleAutoSEO = async () => {
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

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
                method: "POST",
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
            if (!res.ok) throw new Error(data.error || "Failed to add tool");

            router.push("/admin/tools");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/admin/tools" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    &larr; Back to Tool Catalog Management
                </Link>
            </div>

            <h1 className="text-4xl font-sans font-bold tracking-tight mb-8">Add New Tool to Catalog</h1>

            {/* MAGIC SCRAPER UI */}
            <div className="mb-10 border-4 border-foreground p-6 bg-muted/30">
                <div className="flex items-center gap-3 mb-4">
                    <Wand2 className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold uppercase tracking-widest">Magic Scraper (Streaming)</h2>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                    Paste a software website URL to instantly scrape, structure, and auto-catalog the tool. 
                    Tokens stream back in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="url" 
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        placeholder="https://example.com/tool"
                        className="flex-1 p-3 bg-transparent border-2 border-border focus:border-foreground focus:outline-none transition-colors font-mono text-sm"
                        disabled={isScraping}
                    />
                    <button 
                        type="button" 
                        onClick={startStreaming}
                        disabled={isScraping || !scrapeUrl}
                        className="bg-foreground text-background px-6 py-3 font-bold uppercase tracking-widest hover:bg-background hover:text-foreground border-2 border-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isScraping ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></span>
                                Scraping...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Initiate Magic
                            </>
                        )}
                    </button>
                </div>
            </div>

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
                            <label className="text-sm font-bold tracking-widest uppercase block">URL Slug <span className="text-[10px] text-muted-foreground font-normal normal-case">(auto-generated, editable)</span></label>
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
                        {loading ? "Adding..." : "Add Tool"}
                    </button>
                </div>
            </form>
        </div>
    );
}
