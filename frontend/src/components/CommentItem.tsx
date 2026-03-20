"use client";

import { formatDistanceToNow } from "date-fns";
import { Link as LinkIcon, ThumbsUp } from "lucide-react";
import { useState } from "react";

type Comment = {
    id: string;
    news_id: string;
    user_id: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
    user_name: string;
    user_avatar: string;
};

export default function CommentItem({ comment }: { comment: Comment }) {
    const [hasLiked, setHasLiked] = useState(false);

    // Provide default anonymous state
    const displayAvatar = !comment.is_anonymous && comment.user_avatar;
    const displayName = comment.is_anonymous ? "Anonymous" : (comment.user_name || "User");
    const avatarFallback = displayName.substring(0, 1).toUpperCase();

    return (
        <article id={`comment-${comment.id}`} className="p-5 md:p-6 rounded-2xl border transition-all duration-300 border-border bg-card shadow-sm hover:shadow-md">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {displayAvatar ? (
                        <img
                            src={comment.user_avatar}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                            {avatarFallback}
                        </span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                            {displayName}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {formatDistanceToNow(new Date(comment.created_at))} ago
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-foreground/80 leading-[1.7] text-sm md:text-base whitespace-pre-wrap mb-6 pl-[3.5rem]">
                {comment.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 pl-[3.5rem]">
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => setHasLiked(true)}
                        disabled={hasLiked}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${hasLiked ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'}`}
                    >
                        <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>0</span>
                    </button>
                    <a
                        href={`#/comment-${comment.id}`}
                        className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all border border-transparent"
                        title="Link to comment"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </article>
    );
}
