"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CommentForm({ articleId }: { articleId: string }) {
    const [text, setText] = useState('');
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUser();

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

        if (!text.trim()) return;
        setPosting(true);

        try {
            const { error: insertError } = await supabase.from('comments').insert({
                news_id: articleId,
                user_id: user?.id || null,
                content: text.trim(),
                is_anonymous: !user
            });

            if (insertError) throw insertError;
            setText('');
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message || 'Error posting comment');
        } finally {
            setPosting(false);
        }
    };

    const handleLogin = async () => {
        window.location.href = "/login";
        return;
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-1">
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={user ? "Share your insights..." : "Share your insights anonymously..."}
                    className="w-full min-h-[120px] p-5 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-base text-foreground resize-y transition-all shadow-sm placeholder:text-muted-foreground/50"
                    required
                    minLength={10}
                    maxLength={500}
                />
            </div>

            {error && <p className="text-red-400 text-sm mt-3 font-medium px-1">{error}</p>}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        {user && user.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                                ?
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                        <span className={text.length < 10 ? 'text-amber-500/80' : 'text-emerald-500/80'}>
                            {text.length}
                        </span>
                        /500
                    </span>
                    {!user && (
                        <span className="text-xs text-muted-foreground/50 ml-2 border-l border-border pl-2">
                            Posting Anonymously
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!user && (
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full sm:w-auto bg-transparent border border-border text-foreground hover:bg-muted px-4 py-3 rounded-xl font-bold tracking-wide text-sm transition-all shadow-sm"
                        >
                            Sign In
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={posting || text.length < 10}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold tracking-wide text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {posting ? 'Posting...' : 'Post Insight'}
                    </button>
                </div>
            </div>
        </form>
    );
}
