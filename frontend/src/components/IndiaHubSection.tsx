import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, IndianRupee } from 'lucide-react';

// Assuming newsItems are passed in, typed as any for now to decouple from Prisma client typing
export default function IndiaHubSection({ blogs = [] }: { blogs: any[] }) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="w-full mt-16 pt-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-orange-500/10 p-2 rounded-lg">
                        <IndianRupee className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-sans tracking-tight">India Tech Hub</h2>
                        <p className="text-sm text-muted-foreground mt-1">Exclusive guides and insights for Tier-3 freshers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Link 
                            key={blog.id} 
                            href={`/news/${blog.slug}`}
                            className="group relative flex flex-col bg-card border border-border/50 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 overflow-hidden"
                        >
                            {/* Subtle background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-transparent group-hover:from-orange-500/5 transition-colors duration-500" />
                            
                            <div className="relative flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold tracking-wide uppercase">
                                        <BookOpen className="w-3 h-3" />
                                        Guide
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold font-sans tracking-tight mb-3 group-hover:text-orange-500/90 transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                                    {blog.summary}
                                </p>
                            </div>

                            <div className="relative mt-auto flex items-center text-sm font-semibold text-orange-500/80 group-hover:text-orange-500 transition-colors">
                                Read Insight
                                <ArrowRight className="w-4 h-4 ml-2 pb-[1px] transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
