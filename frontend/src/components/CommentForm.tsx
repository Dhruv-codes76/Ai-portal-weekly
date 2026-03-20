"use client";

import { useState, useEffect } from "react";
import { postComment } from "@/lib/commentsApi";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CommentForm({ articleId, parentId, onSuccess }: { articleId: string, parentId?: string, onSuccess?: () => void }) {
    const [text, setText] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const router = useRouter();

    useEffect(() => {
        // Fetch current user
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        fetchUser();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await postComment(
                articleId,
                text,
                parentId,
                honeypot,
                user?.id,
                user?.user_metadata?.full_name,
                user?.user_metadata?.avatar_url
            );
            setText('');
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message :  'Error posting comment');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.1)]">
                <p className="text-muted-foreground font-medium">Join the conversation</p>
                <button
                    onClick={async () => {
                        await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: { redirectTo: `${window.location.origin}/auth/callback` }
                        });
                    }}
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-semibold transition-all duration-200"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in to Post
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-1">
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your insights..."
                    className="w-full min-h-[120px] p-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-base text-foreground resize-y transition-all shadow-[0_4px_20px_rgb(0,0,0,0.1)] placeholder:text-muted-foreground/50"
                    required
                    minLength={25}
                    maxLength={500}
                />

                {/* Honeypot field - visually hidden */}
                <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden opacity-0 absolute w-0 h-0"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            {error && <p className="text-red-400 text-sm mt-3 font-medium px-1">{error}</p>}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-white/50">
                                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                        <span className={text.length < 25 ? 'text-orange-400/80' : 'text-green-400/80'}>
                            {text.length}
                        </span>
                        /500 characters
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading || text.length < 25}
                    className="w-full sm:w-auto bg-foreground text-background px-8 py-3 rounded-xl font-bold tracking-wide text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    {loading ? 'Posting...' : 'Post Insight'}
                </button>
            </div>
        </form>
    );
}
