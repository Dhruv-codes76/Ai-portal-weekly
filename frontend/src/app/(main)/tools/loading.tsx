import PageHeader from "@/components/PageHeader";

export default function LoadingTools() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            <PageHeader
                title="Curated AI Tools"
                subtitle="High-impact tooling to supercharge your intelligence stack."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                        {/* Top half skeleton */}
                        <div className="relative w-full pt-[40%] bg-white/10 animate-pulse border-b border-white/5"></div>

                        {/* Content Skeleton */}
                        <div className="flex flex-col flex-grow p-6 lg:p-8 space-y-4">
                            {/* Tags Skeleton */}
                            <div className="flex space-x-2">
                                <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse"></div>
                            </div>

                            {/* Title Skeleton */}
                            <div className="space-y-2 mt-4">
                                <div className="h-7 w-3/4 bg-white/10 rounded animate-pulse"></div>
                            </div>

                            {/* Description Skeleton */}
                            <div className="space-y-2 mt-4">
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                                <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
