import { getTools, getCategories } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import ToolsClient from "./ToolsClient";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Best AI Tools for Indian CSE Students & Freshers",
    description: "Curated, vetted AI tools to help Indian freshers land jobs and build side hustles. Honest reviews, student-friendly pricing.",
};

export default async function ToolsPage() {
    const [toolsData, categories] = await Promise.all([
        getTools(1, 100), // Fetch a larger set for client-side filtering MVP
        getCategories()
    ]);

    const initialTools = toolsData?.data || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <PageHeader 
                title="AI Tools Catalog" 
                subtitle="Carefully vetted. Highly actionable." 
            />

            <ToolsClient initialTools={initialTools} categories={categories || []} />
        </div>
    );
}
