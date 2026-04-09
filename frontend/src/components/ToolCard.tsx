import Link from "next/link";
import { Wrench } from "lucide-react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface ToolItem {
    _id: string;
    name: string;
    slug: string;
    description: string;
    pricing: string;
    category?: Category;
}

export default function ToolCard({ tool }: { tool: ToolItem }) {
    return (
        <article className="group flex flex-col h-full bg-[#0d0d0d] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:bg-[#151515] hover:border-white/10 relative">
            {/* Subtle top glow line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Link prefetch={true} href={`/tools/${tool.slug}`} className="flex flex-col h-full z-10">
                 {/* Image Placeholder (sleek dark gradient) */}
                 <div className="relative w-full pt-[45%] bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center overflow-hidden border-b border-white/5">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 transition-transform duration-700 group-hover:scale-105 group-hover:text-white/40">
                        <Wrench className="w-8 h-8" />
                    </div>
                    {/* Category Label overlaid */}
                    {tool.category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-wider text-white/80">
                                {tool.category.name}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-grow p-6">
                    <div className="mb-3">
                        <h3 className="font-sans text-lg font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors line-clamp-1">
                            {tool.name}
                        </h3>
                    </div>

                    <p className="text-sm text-white/50 flex-grow line-clamp-3 leading-relaxed font-light mb-6">
                        {tool.description}
                    </p>

                    <div className="mt-auto flex justify-between items-center text-xs tracking-wide">
                        <span className="font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60 group-hover:text-white/80 group-hover:border-white/10 transition-all capitalize">
                            {tool.pricing || "Freemium"}
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
