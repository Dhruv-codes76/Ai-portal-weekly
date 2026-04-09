"use client";

import { useState, useMemo } from "react";
import ToolCard from "@/components/ToolCard";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";

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

interface ToolsClientProps {
    initialTools: ToolItem[];
    categories: Category[];
}

export default function ToolsClient({ initialTools, categories }: ToolsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredTools = useMemo(() => {
        return initialTools.filter((tool) => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory 
                ? tool.category?._id === selectedCategory || tool.category?.slug === selectedCategory
                : true;

            return matchesSearch && matchesCategory;
        });
    }, [initialTools, searchQuery, selectedCategory]);

    return (
        <div className="flex flex-col space-y-8">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors text-sm sm:text-base placeholder:text-muted-foreground"
                        placeholder="Search AI tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories Pills (Scrollable) */}
                <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="flex space-x-2 md:justify-end min-w-max">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === null
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white/5 text-foreground hover:bg-white/10 border border-white/5"
                            }`}
                        >
                            All Tools
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === cat._id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/5 text-foreground hover:bg-white/10 border border-white/5"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                    {filteredTools.map((tool) => (
                        <ToolCard key={tool._id} tool={tool} />
                    ))}
                </div>
            ) : (
                <div className="pt-12">
                    <EmptyState message={`No tools found for "${searchQuery}"`} />
                </div>
            )}
        </div>
    );
}
