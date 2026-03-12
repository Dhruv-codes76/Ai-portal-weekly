"use client";

import { useState, useEffect } from "react";
import { Globe, Share2, Twitter, Info } from "lucide-react";

interface SEOData {
    seoMetaTitle: string;
    seoMetaDescription: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string[];
}

interface SEOEditorProps {
    data: SEOData;
    onChange: (newData: Partial<SEOData>) => void;
    baseSlug: string;
    type: "news" | "tool";
}

export default function SEOEditor({ data, onChange, baseSlug, type }: SEOEditorProps) {
    const [activeTab, setActiveTab] = useState<"google" | "social">("google");
    const baseUrl = "https://ai-news-portal.com"; // Replace with actual domain
    const fullUrl = `${baseUrl}/${type === "news" ? "news" : "tools"}/${baseSlug}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    return (
        <div className="border border-border p-6 space-y-8 bg-card/50">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    SEO Search Optimizer
                </h3>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => setActiveTab("google")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border ${activeTab === "google" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                    >
                        Google Preview
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab("social")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border ${activeTab === "social" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                    >
                        Social Preview
                    </button>
                </div>
            </div>

            {/* Google Search Preview */}
            {activeTab === "google" && (
                <div className="space-y-6">
                    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl">
                        <cite className="text-sm text-[#202124] not-italic mb-1 block">
                            {baseUrl} <span className="text-[#5f6368]">› {type === "news" ? "news" : "tools"} › {baseSlug}</span>
                        </cite>
                        <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1 font-medium truncate">
                            {data.seoMetaTitle || "Enter a meta title..."}
                        </h4>
                        <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                            <span className="text-[#70757a]">Mar 9, 2026 — </span>
                            {data.seoMetaDescription || "Start writing a description to see how it looks in Google search results."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase flex items-center gap-1">
                                Meta Title
                                <Info className="w-3 h-3 text-muted-foreground" />
                            </label>
                            <input
                                type="text"
                                name="seoMetaTitle"
                                value={data.seoMetaTitle}
                                onChange={handleChange}
                                placeholder="Recommended: 50-60 characters"
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                            />
                            <div className="text-[10px] text-muted-foreground flex justify-between">
                                <span>Optimal: 60 chars</span>
                                <span className={data.seoMetaTitle.length > 60 ? "text-red-500 font-bold" : ""}>
                                    {data.seoMetaTitle.length} characters
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest uppercase">Meta Description</label>
                            <textarea
                                name="seoMetaDescription"
                                rows={3}
                                value={data.seoMetaDescription}
                                onChange={handleChange}
                                placeholder="Recommended: 150-160 characters"
                                className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm resize-none"
                            />
                            <div className="text-[10px] text-muted-foreground flex justify-between">
                                <span>Optimal: 160 chars</span>
                                <span className={data.seoMetaDescription.length > 160 ? "text-red-500 font-bold" : ""}>
                                    {data.seoMetaDescription.length} characters
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Preview (Generic) */}
            {activeTab === "social" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Facebook/OG Preview */}
                        <div className="space-y-3">
                            <h5 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Facebook / OG
                            </h5>
                            <div className="border border-[#dadde1] rounded-sm overflow-hidden bg-white max-w-sm">
                                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-[#dadde1]">
                                    {data.ogImage ? (
                                        <img src={data.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Share2 className="w-12 h-12 text-gray-300" />
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="text-[11px] text-[#606770] uppercase tracking-tighter mb-1 truncate">{baseUrl}</div>
                                    <div className="font-bold text-[#1d2129] leading-tight mb-1 truncate">{data.ogTitle || data.seoMetaTitle}</div>
                                    <div className="text-xs text-[#606770] line-clamp-1">{data.ogDescription || data.seoMetaDescription}</div>
                                </div>
                            </div>
                        </div>

                        {/* Twitter Preview */}
                        <div className="space-y-3">
                            <h5 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Twitter className="w-4 h-4" /> Twitter / X
                            </h5>
                            <div className="border border-[#e1e8ed] rounded-xl overflow-hidden bg-white max-w-sm">
                                <div className="h-44 bg-gray-100 flex items-center justify-center border-b border-[#e1e8ed]">
                                    {data.twitterImage ? (
                                        <img src={data.twitterImage} alt="Twitter Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Twitter className="w-12 h-12 text-gray-300" />
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="font-bold text-[#14171a] leading-tight mb-1 truncate">{data.twitterTitle || data.seoMetaTitle}</div>
                                    <div className="text-xs text-[#657786] line-clamp-2">{data.twitterDescription || data.seoMetaDescription}</div>
                                    <div className="text-xs text-[#657786] mt-1 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {baseUrl.replace(/^https?:\/\//, '')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase">OG Title Override</label>
                                <input
                                    type="text"
                                    name="ogTitle"
                                    value={data.ogTitle || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase">OG Image URL</label>
                                <input
                                    type="text"
                                    name="ogImage"
                                    value={data.ogImage || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-2 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase">Twitter Title Override</label>
                                <input
                                    type="text"
                                    name="twitterTitle"
                                    value={data.twitterTitle || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase">Twitter Image URL</label>
                                <input
                                    type="text"
                                    name="twitterImage"
                                    value={data.twitterImage || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-2 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="pt-4 border-t border-border">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase">Canonical URL (Optional)</label>
                    <input
                        type="url"
                        name="canonicalUrl"
                        value={data.canonicalUrl || ""}
                        onChange={handleChange}
                        placeholder={fullUrl}
                        className="w-full p-2 bg-transparent border border-border focus:border-foreground focus:outline-none text-xs font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                        Leave blank to use this page's URL as canonical.
                    </p>
                </div>
            </div>
        </div>
    );
}
