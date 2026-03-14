import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="border-b-4 border-foreground pb-6 mb-12">
            <h1 className="text-5xl font-sans font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg italic font-sans">{subtitle}</p>
        </div>
    );
}
