import ToolCard from "@/components/ToolCard";

async function getTools() {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`;
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) {
        console.error("Failed to fetch tools:", res.status);
        return [];
    }
    return res.json();
}

export const metadata = {
    title: "Explore AI Tools | Curated Editorial",
    description: "Find the exact AI tool you need. No hype, just facts.",
};

export default async function ToolsPage() {
    const tools = await getTools();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="border-b-4 border-foreground pb-6 mb-12">
                <h1 className="text-5xl font-sans font-bold tracking-tight mb-4">AI Tools Catalog</h1>
                <p className="text-muted-foreground text-lg italic font-sans">Carefully vetted. Highly actionable.</p>
            </div>

            {tools && tools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool: any) => (
                        <ToolCard key={tool._id} tool={tool} />
                    ))}
                </div>
            ) : (
                <div className="py-20 border border-dashed border-border text-center">
                    <h3 className="text-2xl font-sans text-muted-foreground italic">No tools cataloged yet.</h3>
                </div>
            )}
        </div>
    );
}
