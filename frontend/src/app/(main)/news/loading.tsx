import PageHeader from "@/components/PageHeader";

export default function LoadingNews() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            <PageHeader
                title="AI News Directory"
                subtitle="The signal, cleanly separated from the noise."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                        {/* Image Skeleton */}
                        <div className="relative w-full pt-[56.25%] bg-white/10 animate-pulse"></div>

                        {/* Content Skeleton */}
                        <div className="flex flex-col flex-grow p-6 lg:p-8 space-y-4">
                            {/* Date Skeleton */}
                            <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse"></div>

                            {/* Title Skeleton */}
                            <div className="space-y-2 mt-2">
                                <div className="h-6 w-full bg-white/10 rounded animate-pulse"></div>
                                <div className="h-6 w-4/5 bg-white/10 rounded animate-pulse"></div>
                            </div>

                            {/* Summary Skeleton */}
                            <div className="space-y-2 mt-4">
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                                <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse"></div>
                            </div>

                            {/* Actions Skeleton */}
                            <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse"></div>
                                    <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
