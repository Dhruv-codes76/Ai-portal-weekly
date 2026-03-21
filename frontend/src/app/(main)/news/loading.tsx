
export default function LoadingNews() {
    return (
        <>
            {/* Mobile View (< 768px) */}
            <div className="block md:hidden h-[100dvh] w-screen bg-background overflow-hidden relative">
                <div className="absolute inset-0 z-0 bg-muted animate-pulse"></div>
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background to-transparent h-[60vh]"></div>

                <div className="relative z-20 w-full h-full flex flex-col justify-end p-4 pb-24">
                    <div className="w-16 h-5 bg-white/20 dark:bg-white/10 rounded animate-pulse mb-3"></div>
                    <div className="w-3/4 h-8 bg-white/20 dark:bg-white/10 rounded animate-pulse mb-3"></div>
                    <div className="w-2/3 h-8 bg-white/20 dark:bg-white/10 rounded animate-pulse mb-6"></div>

                    <div className="space-y-2 mb-6">
                        <div className="w-full h-4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                        <div className="w-5/6 h-4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                        <div className="w-4/5 h-4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                    </div>
                </div>

                <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center z-30">
                    <div className="w-11 h-11 rounded-full bg-white/20 dark:bg-white/10 animate-pulse"></div>
                    <div className="w-11 h-11 rounded-full bg-white/20 dark:bg-white/10 animate-pulse"></div>
                    <div className="w-11 h-11 rounded-full bg-white/20 dark:bg-white/10 animate-pulse"></div>
                </div>
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block max-w-[900px] mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-10 tracking-tight text-foreground">
                    Latest Insights
                </h1>
                <div className="flex flex-col gap-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-6 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="w-[300px] h-full relative shrink-0 bg-muted animate-pulse min-h-[192px]"></div>
                            <div className="flex flex-col justify-center p-6 pl-2 w-full space-y-4">
                                <div className="h-3 w-1/4 bg-muted rounded animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-7 w-3/4 bg-muted rounded animate-pulse"></div>
                                    <div className="h-7 w-1/2 bg-muted rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
