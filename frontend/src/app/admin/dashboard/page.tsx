"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import HardwareIcon from "@mui/icons-material/Hardware";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if token exists, strictly client-side
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    if (!isAuthenticated) return null; // Or a loading spinner

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                        <DashboardIcon className="text-primary w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage platform content and view operational logs.</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-xl font-bold transition-all text-sm"
                >
                    <ExitToAppIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/news" className="group">
                    <div className="glass-card rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border-t-4 border-t-primary/50 hover:border-t-primary flex flex-col items-center text-center justify-center">
                        <ArticleIcon className="w-16 h-16 text-primary mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Manage News</h2>
                        <p className="text-muted-foreground">Create, edit, or deactivate AI news articles.</p>
                    </div>
                </Link>

                <Link href="/admin/tools" className="group">
                    <div className="glass-card rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 border-t-4 border-t-accent/50 hover:border-t-accent flex flex-col items-center text-center justify-center">
                        <HardwareIcon className="w-16 h-16 text-accent mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Manage Tools</h2>
                        <p className="text-muted-foreground">Add new software or update the existing catalog.</p>
                    </div>
                </Link>

                <Link href="/admin/logs" className="group md:col-span-2">
                    <div className="glass-card rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border-t-4 border-t-primary/50 hover:border-t-primary flex flex-col items-center text-center justify-center">
                        <h2 className="text-2xl font-bold mb-2 flex items-center">
                            View Activity Audit Trail
                        </h2>
                        <p className="text-muted-foreground">Monitor system operations, logins, and soft deletions.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
