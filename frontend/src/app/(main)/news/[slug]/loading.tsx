import BackLink from "@/components/BackLink";

export default function LoadingNewsDetail() {
    return (
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-16 animate-fade-in pb-24 w-full">
            <div className="mb-8 sticky top-0 bg-[#05050A]/80 backdrop-blur-xl z-10 py-4 -mx-4 px-4 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:mx-0">
                <BackLink href="/news" label="Back" />
            </div>

            <article className="space-y-6 md:space-y-8 rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 shadow-2xl backdrop-blur-3xl w-full">

                {/* Hero Image Skeleton */}
                <div className="w-full aspect-video rounded-xl bg-white/5 border border-white/10 shadow-lg animate-pulse overflow-hidden"></div>

                <header className="pb-6 border-b border-white/10 space-y-4">
                    {/* Title Skeleton */}
                    <div className="space-y-3">
                        <div className="h-10 md:h-12 w-full bg-white/10 rounded-md animate-pulse"></div>
                        <div className="h-10 md:h-12 w-4/5 bg-white/10 rounded-md animate-pulse"></div>
                    </div>

                    {/* Meta/Date Skeleton */}
                    <div className="flex items-center space-x-3 mt-6">
                        <div className="h-4 w-24 bg-white/10 rounded-sm animate-pulse"></div>
                        <span className="text-white/20">&middot;</span>
                        <div className="h-4 w-32 bg-white/10 rounded-sm animate-pulse"></div>
                    </div>
                </header>

                {/* Summary Skeleton */}
                <div className="border-l-4 border-white/10 pl-6 py-2 my-8 space-y-3">
                    <div className="h-6 w-full bg-white/10 rounded animate-pulse"></div>
                    <div className="h-6 w-5/6 bg-white/10 rounded animate-pulse"></div>
                </div>

                {/* Body Content Skeleton */}
                <div className="space-y-6 mt-12">
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-[85%] bg-white/5 rounded animate-pulse"></div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-[95%] bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse"></div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                        <div className="h-4 w-[80%] bg-white/5 rounded animate-pulse"></div>
                    </div>
                </div>
            </article>

            {/* Comment Section Skeleton */}
            <div className="mt-16 pt-12 border-t border-white/5">
                <div className="h-8 w-40 bg-white/10 rounded animate-pulse mb-8"></div>
                <div className="w-full h-32 bg-white/5 rounded-xl border border-white/10 animate-pulse mb-8"></div>

                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse flex-shrink-0"></div>
                            <div className="space-y-2 w-full pt-1">
                                <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                                <div className="h-3 w-20 bg-white/5 rounded animate-pulse mt-1 mb-3"></div>
                                <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                                <div className="h-4 w-4/5 bg-white/5 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
