import React from "react";

interface EmptyStateProps {
    message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="py-20 border border-dashed border-border text-center">
            <h3 className="text-2xl font-sans text-muted-foreground italic">{message}</h3>
        </div>
    );
}
