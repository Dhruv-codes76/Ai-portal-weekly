import BackLink from "@/components/BackLink";

export default function LoadingToolDetail() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in w-full">
            <div className="mb-12">
                <BackLink href="/tools" label="Directory" />
            </div>

            <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-12 w-full">
                <header className="flex flex-col md:flex-row gap-8 items-start mb-12 border-b border-white/10 pb-12">
                    {/* Logo Skeleton */}
                    <div className="w-24 h-24 rounded-2xl bg-white/10 animate-pulse flex-shrink-0 shadow-lg"></div>

                    <div className="flex-grow w-full">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {/* Title Skeleton */}
                            <div className="h-10 w-64 bg-white/10 rounded-md animate-pulse"></div>
                            {/* Badges Skeleton */}
                            <div className="flex gap-2">
                                <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="h-6 w-full bg-white/10 rounded animate-pulse mb-3"></div>
                        <div className="h-6 w-4/5 bg-white/10 rounded animate-pulse mb-6"></div>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            {/* Button Skeleton */}
                            <div className="h-12 w-48 bg-white/10 rounded-full animate-pulse"></div>
                            <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section Title Skeleton */}
                        <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>

                        {/* Body Content Skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-[95%] bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-[85%] bg-white/5 rounded animate-pulse"></div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-[95%] bg-white/5 rounded animate-pulse"></div>
                            <div className="h-4 w-[90%] bg-white/5 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                            {/* Specs Title Skeleton */}
                            <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-6"></div>

                            {/* Specs List Skeleton */}
                            <div className="space-y-6">
                                <div>
                                    <div className="h-3 w-16 bg-white/10 rounded mb-2 animate-pulse"></div>
                                    <div className="h-5 w-24 bg-white/5 rounded animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="h-3 w-20 bg-white/10 rounded mb-2 animate-pulse"></div>
                                    <div className="h-5 w-32 bg-white/5 rounded animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="h-3 w-24 bg-white/10 rounded mb-2 animate-pulse"></div>
                                    <div className="h-5 w-28 bg-white/5 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
