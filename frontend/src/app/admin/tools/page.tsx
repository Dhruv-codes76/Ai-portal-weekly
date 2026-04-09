/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HardwareIcon from "@mui/icons-material/Hardware";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import EditOpenIcon from "@mui/icons-material/EditOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArticleIcon from "@mui/icons-material/Article";

export default function AdminToolsPage() {
    const router = useRouter();
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [includeDeleted, setIncludeDeleted] = useState(false);

    const fetchTools = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const params = new URLSearchParams({
                limit: "100",
                search: searchQuery,
                includeDeleted: String(includeDeleted)
            });

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools?${params.toString()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed fetch");

            setTools(data.data || data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Debounced search/filter
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTools();
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilter, includeDeleted]);

    const deactivateTool = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this tool?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchTools();
            else alert("Failed to deactivate.");
        } catch {
            alert("Error occurred.");
        }
    };

    const restoreTool = async (id: string) => {
        if (!confirm("Are you sure you want to restore this tool?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${id}/restore`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchTools();
            else alert("Failed to restore.");
        } catch {
            alert("Error occurred.");
        }
    };

    const handleAutoFill = async () => {
        const url = prompt("Enter the website URL of the tool to auto-fill via AI:");
        if (!url) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/auto-fill`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Failed to auto-fill");
            alert("Tool successfully generated and saved as Draft!");
            fetchTools();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error occurred during auto-fill.");
            setLoading(false);
        }
    };

    const getSEOStatus = (item: any) => {
        const issues = [];
        if (!item.focusKeyphrase) issues.push("Focus Keyphrase Missing");
        if (!item.seoMetaDescription || item.seoMetaDescription.length < 50) issues.push("Short or Missing Meta");
        if (!item.featuredImage) issues.push("Missing Thumbnail");
        return issues;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-8 font-medium">
                <ArrowBackIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
                        <HardwareIcon className="w-8 h-8 mr-3 text-accent" />
                        Manage Tools
                    </h1>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleAutoFill}
                        className="px-5 py-2.5 bg-accent text-white hover:bg-accent/90 border border-transparent font-bold tracking-widest uppercase text-sm transition-colors rounded shadow-sm"
                    >
                        Auto-Fill URL
                    </button>
                    <Link
                        href="/admin/tools/create"
                        className="px-5 py-2.5 bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground font-bold tracking-widest uppercase text-sm transition-colors rounded shadow-sm"
                    >
                        + Add New Tool
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2 relative">
                    <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground block mb-2">Search Tools</label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Enter tool name or focus keyphrase..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all rounded-lg text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground block mb-2">Status</label>
                    <div className="relative">
                        <FilterListIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border focus:border-accent outline-none transition-all rounded-lg text-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All States</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center h-[42px] mb-0.5">
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={includeDeleted}
                                onChange={(e) => setIncludeDeleted(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${includeDeleted ? 'bg-accent' : 'bg-muted'}`}></div>
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${includeDeleted ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-[10px] font-black tracking-widest uppercase text-muted-foreground group-hover:text-accent transition-colors">Show Deactivated</span>
                    </label>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden border border-border shadow-sm">
                {loading && tools.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-widest uppercase text-xs">Scanning Catalog...</span>
                    </div>
                ) : tools.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground italic font-medium">No results found for your query.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b border-border bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Tool Intel</th>
                                    <th className="px-6 py-4 font-bold">SEO Health</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tools.map((item: any) => {
                                    const seoIssues = getSEOStatus(item);
                                    return (
                                        <tr key={item._id || item.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.featuredImage ? (
                                                        <img src={item.featuredImage} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground border border-border">
                                                            <HardwareIcon className="w-5 h-5 opacity-50" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground text-base tracking-tight">{item.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Link href={`/tools/${item.slug}`} target="_blank" className="hover:text-accent flex items-center gap-1">
                                                                /{item.slug}
                                                            </Link>
                                                            • {item.category?.name || 'Uncategorized'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {seoIssues.length === 0 ? (
                                                    <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                                                        <CheckCircleOutlineIcon className="w-3.5 h-3.5" />
                                                        Healthy
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                                                            <ErrorOutlineIcon className="w-3.5 h-3.5" />
                                                            {seoIssues.length} Critical Issue{seoIssues.length > 1 ? 's' : ''}
                                                        </div>
                                                        <span className="text-[8px] text-muted-foreground/60 italic truncate max-w-[150px]">
                                                            {seoIssues.join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {item.isDeleted ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">Deactivated</span>
                                                    ) : item.status === 'PUBLISHED' ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">Published</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Draft</span>
                                                    )}
                                                    <span className="text-[9px] text-muted-foreground font-medium ml-1">
                                                        {item.pricing.toLowerCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link
                                                    href={`/admin/tools/edit/${item.id || item._id}`}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                                    title="Edit Intelligence"
                                                >
                                                    <EditOpenIcon className="w-5 h-5" />
                                                </Link>
                                                {item.isDeleted ? (
                                                    <button
                                                        onClick={() => restoreTool(item.id || item._id)}
                                                        className="inline-flex items-center justify-center p-2 rounded-lg text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all"
                                                        title="Restore"
                                                    >
                                                        <AutorenewIcon className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => deactivateTool(item.id || item._id)}
                                                        className="inline-flex items-center justify-center p-2 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
                                                        title="Retire/Deactivate"
                                                    >
                                                        <VisibilityOffIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
