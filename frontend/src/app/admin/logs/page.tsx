"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SyncIcon from "@mui/icons-material/Sync";

export default function AdminLogsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return router.push("/admin/login");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/logs?limit=50`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed fetch");

            setLogs(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
                <ArrowBackIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
                        <ReceiptLongIcon className="w-8 h-8 mr-3 text-primary" />
                        Activity Audit Trail
                    </h1>
                </div>

                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-bold transition-all"
                >
                    <SyncIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Latest
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden border border-border">
                {loading && logs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Fetching classified logs...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No activity recorded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b border-border bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Admin</th>
                                    <th className="px-6 py-4 font-bold">Action</th>
                                    <th className="px-6 py-4 font-bold">Resource</th>
                                    <th className="px-6 py-4 font-bold">IP Address</th>
                                    <th className="px-6 py-4 font-bold text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.map((log: any) => (
                                    <tr key={log._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{log.adminEmail}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${log.action === 'LOGIN' ? 'bg-blue-500/10 text-blue-500' :
                                                    log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                                                        log.action === 'DEACTIVATE' ? 'bg-red-500/10 text-red-500' :
                                                            log.action === 'UPDATE' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                'bg-secondary text-secondary-foreground'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{log.resource} <span className="text-xs opacity-50">({log.resourceId?.substring(0, 6)}...)</span></td>
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.ipAddress || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">
                                            {new Date(log.createdAt).toLocaleString()}
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
