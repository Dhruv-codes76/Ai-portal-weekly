"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SEOEditor from "@/components/admin/SEOEditor";
import FeaturedImagePortal from "@/components/admin/FeaturedImagePortal";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        sourceLink: "",
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
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return router.push("/admin/login");

                // Assuming the backend has a way to fetch an article by ID.
                // The current newsRoutes.js maps GET /:slug to getNewsBySlug.
                // If it needs an ID, we might have to fetch all and filter or use slug.
                // Let's use the all news list and filter for now to be safe, or just use the API if it's there.
                // Wait, examining the `newsRoutes.js`:
                // router.get('/', getNews);
                // router.get('/:slug', getNewsBySlug);
                // The backend fetches by slug, but here we have the ID.
                // Let's fetch all news and find by ID since this is admin.
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch article");

                const article = data.data.find((item: any) => item._id === id);
                if (!article) throw new Error("Article not found");

                setFormData({
                    title: article.title || "",
                    slug: article.slug || "",
                    summary: article.summary || "",
                    content: article.content || "",
                    sourceLink: article.sourceLink || "",
                    status: article.status || "draft",
                    seoMetaTitle: article.seoMetaTitle || "",
                    seoMetaDescription: article.seoMetaDescription || "",
                    canonicalUrl: article.canonicalUrl || "",
                    ogTitle: article.ogTitle || "",
                    ogDescription: article.ogDescription || "",
                    ogImage: article.ogImage || "",
                    twitterTitle: article.twitterTitle || "",
                    twitterDescription: article.twitterDescription || "",
                    twitterImage: article.twitterImage || "",
                    featuredImage: article.featuredImage || "",
                    featuredImageAlt: article.featuredImageAlt || "",
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setFetching(false);
            }
        };

        fetchArticle();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title (only if not already set by fetching, or keep sync)
        if (name === "title" && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update article");

            router.push("/admin/news");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center text-muted-foreground">
                Loading article data...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/admin/news" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center">
                    <ArrowBackIcon className="w-4 h-4 mr-2" />
                    Back to News Management
                </Link>
            </div>

            <h1 className="text-4xl font-sans font-bold tracking-tight mb-8">Edit Intelligence Brief</h1>

            {error && (
                <div className="mb-8 p-4 border border-red-500 text-red-500 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <FeaturedImagePortal 
                    imageUrl={formData.featuredImage}
                    imageAlt={formData.featuredImageAlt}
                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Headline</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">URL Slug</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest uppercase block">Summary (Lead Paragraph)</label>
                    <textarea
                        required
                        name="summary"
                        rows={3}
                        value={formData.summary}
                        onChange={handleChange}
                        className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors resize-y"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest uppercase block mb-2">Full Content (Intel Feed)</label>
                    {/* Only render editor once data is fetched to avoid initialization issues */}
                    {!fetching && (
                        <RichTextEditor 
                            content={formData.content}
                            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                            placeholder="Start typing your intelligence brief here..."
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-widest uppercase block">Original Source URL (Optional)</label>
                        <input
                            type="url"
                            name="sourceLink"
                            value={formData.sourceLink}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors"
                        />
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

                <div className="pt-8 border-t border-border">
                    <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Search Engine Optimization (SEO)</h2>
                    <SEOEditor 
                        data={formData} 
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        baseSlug={formData.slug}
                        type="news"
                    />
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border border-foreground transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
