export default function NewsLayout({ children }: { children: React.ReactNode }) {
    // We remove the strict 100vh height requirement here because the desktop layout needs to scroll naturally.
    // The MobileReelsView enforces its own 100dvh height inside its component wrapper.
    return (
        <div className="w-full h-full min-h-[calc(100vh-64px)] overflow-x-hidden">
            {children}
        </div>
    );
}
