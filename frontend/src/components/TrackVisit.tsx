"use client";

import { useEffect } from "react";

export default function TrackVisit({ slug }: { slug: string }) {
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/tools/${slug}/visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).catch(err => console.error("Failed to track visit", err));
    }, [slug]);

    return null;
}
