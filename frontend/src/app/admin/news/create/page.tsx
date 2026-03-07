"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        sourceLink: "",
        status: "draft",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
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

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create article");

            router.push("/admin/news");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/admin/news" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    &larr; Back to News Management
                </Link>
            </div>

            <h1 className="text-4xl font-sans font-bold tracking-tight mb-8">Draft Intelligence Brief</h1>

            {error && (
                <div className="mb-8 p-4 border border-red-500 text-red-500 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="text-sm font-bold tracking-widest uppercase block">Full Content Markdown</label>
                    <textarea
                        required
                        name="content"
                        rows={12}
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none transition-colors resize-y font-mono text-sm leading-relaxed"
                    />
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

                <div className="pt-8 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-background hover:text-foreground border border-foreground transition-all disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish Article"}
                    </button>
                </div>
            </form>
        </div>
    );
}
