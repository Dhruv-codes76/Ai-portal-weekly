"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";
import { Home, Newspaper, Wrench, Menu, UserCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        // Fetch initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (currentScrollY > 50) {
                        if (currentScrollY > lastScrollY.current) {
                            setIsVisible(false);
                        } else {
                            setIsVisible(true);
                        }
                    } else {
                        setIsVisible(true);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAdminClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(false);
        if (session) {
            router.push("/admin/dashboard");
        } else {
            router.push("/login");
        }
    };

    const handleAuthClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (session) {
            router.push("/admin/dashboard");
        } else {
            router.push("/login");
        }
    };

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "News", href: "/news", icon: Newspaper },
        { name: "Tools", href: "/tools", icon: Wrench },
    ];

    return (
        <>
            <nav
                className={`sticky top-0 backdrop-blur-2xl bg-background/60 border-b border-white/5 transition-transform duration-300 ease-in-out z-50 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <span className="font-sans font-bold text-xl md:text-2xl tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                                AI Portal
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex space-x-12 items-center absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`text-sm tracking-wide transition-all duration-300 relative py-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />

                            <div className="hidden md:block">
                                {session ? (
                                    <button
                                        onClick={handleAuthClick}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-95 hover:brightness-105"
                                    >
                                        {session.user?.user_metadata?.avatar_url ? (
                                            <img src={session.user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <UserCircle className="w-6 h-6 text-foreground" />
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="rounded-full bg-white text-black px-5 py-2.5 font-semibold text-sm hover:brightness-105 active:scale-95 transition-all duration-200 shadow-sm"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>

                            <div className="relative md:hidden">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-card border border-white/10 overflow-hidden animate-fade-in origin-top-right">
                                        <button
                                            onClick={handleAdminClick}
                                            className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                        >
                                            Admin Dashboard
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-t border-white/10 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex justify-around items-center h-16 px-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "fill-current scale-110" : ""}`} />
                                <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>{link.name}</span>
                                {isActive && (
                                    <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-foreground rounded-b-full"></div>
                                )}
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleAdminClick}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative text-muted-foreground hover:text-foreground"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="text-[10px] font-medium tracking-wide opacity-70">Admin</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
