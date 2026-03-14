import Link from "next/link";
import React from "react";

interface BackLinkProps {
    href: string;
    label: string;
}

export default function BackLink({ href, label }: BackLinkProps) {
    return (
        <Link href={href} className="inline-block text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground mb-12 transition-colors">
            &larr; {label}
        </Link>
    );
}
