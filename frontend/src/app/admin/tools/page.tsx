/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HardwareIcon from "@mui/icons-material/Hardware";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function AdminToolsPage() {
    const router = useRouter();
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTools = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed fetch");

            setTools(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deactivateTool = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this tool?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${id}/deactivate`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchTools();
            else alert("Failed to deactivate.");
        } catch {
            alert("Error occurred.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-8 font-medium">
                <ArrowBackIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
                        <HardwareIcon className="w-8 h-8 mr-3 text-accent" />
                        Manage Tools
                    </h1>
                </div>

                <Link
                    href="/admin/tools/create"
                    className="px-5 py-2.5 bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground font-bold tracking-widest uppercase text-sm transition-colors"
                >
                    + Add New Tool
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden border border-border">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading tool records...</div>
                ) : tools.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No tools found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b border-border bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Name</th>
                                    <th className="px-6 py-4 font-bold">Category</th>
                                    <th className="px-6 py-4 font-bold">Pricing</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tools.map((item: any) => (
                                    <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.category?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-muted-foreground capitalize">{item.pricing}</td>
                                        <td className="px-6 py-4">
                                            {item.isDeleted ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">Deactivated</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => deactivateTool(item._id)}
                                                disabled={item.isDeleted}
                                                className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                                                title="Deactivate"
                                            >
                                                <VisibilityOffIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
