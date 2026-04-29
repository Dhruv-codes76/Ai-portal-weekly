const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Wait helper
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared fetch with a 10-second timeout and retry logic
async function apiFetch(path: string, options: RequestInit = {}, retries = 3, backoff = 500) {
    let lastError = null;

    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`${API_BASE}${path}`, {
                ...options,
                signal: AbortSignal.timeout(10000), // fail after 10s
            });

            if (!res.ok) {
                 if (res.status >= 500) {
                      // Server error, try again
                      throw new Error(`Server Error: ${res.status}`);
                 }
                 // Client error (4xx) - usually no point in retrying unless rate limited
                 if (res.status === 429) {
                     throw new Error('Rate limited');
                 }
                 // For 404s or other client errors, fail immediately.
                 throw new Error(`Client Error: ${res.status}`);
            }
            return await res.json();
        } catch (error: unknown) { // Use unknown instead of any
            lastError = error;
            const err = error as Error;
            // Only retry on network errors, timeouts, or 500s
            if (err.name === 'AbortError' || err.message.includes('Server Error') || err.message.includes('Rate limited') || err.message.includes('fetch failed')) {
                console.warn(`Fetch failed for ${path}. Retrying (${i + 1}/${retries})...`);
                await wait(backoff * Math.pow(2, i)); // Exponential backoff
            } else {
                break; // Break early on client errors (like 404) instead of throwing immediately so the SSR fallback handles it
            }
        }
    }

    console.error(`Fetch definitively failed for ${path} after ${retries} retries:`, lastError ? (lastError as Error).message : lastError);
    
    // SEO Hardening: Do NOT throw errors during build time.
    // Instead, return null so the caller can return fallback data.
    return null;
}

export async function getNews(page = 1, limit = 12, region?: string, contentType?: string) {
    // Build query params
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (region) params.append('region', region);
    if (contentType) params.append('contentType', contentType);

    // Revalidate data every 60 seconds to balance freshness with performance
    const data = await apiFetch(`/news?${params.toString()}`, { next: { revalidate: 60 } });
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getNewsBySlug(slug: string) {
    // Revalidate individual news items too
    return apiFetch(`/news/${slug}`, { next: { revalidate: 60 } });
}

export async function getRelatedNews(currentSlug: string, limit: number = 3) {
    // Fetch one extra in case the current slug is in the latest results
    const data = await getNews(1, limit + 1);
    if (!data || !data.data) return [];
    
    // Filter out the current article and slice to the exact limit requested
    const related = data.data.filter((article: any) => article.slug !== currentSlug);
    return related.slice(0, limit);
}

export async function getTools(page = 1, limit = 12, category = '', sort = '') {
    // Revalidate tools catalog every 60 seconds
    const q = category ? `&category=${category}` : '';
    const s = sort ? `&sort=${sort}` : '';
    const raw = await apiFetch(`/tools?page=${page}&limit=${limit}${q}${s}`, { next: { revalidate: 60 } });

    // Backend returns a raw array for tools — normalize to { data, total } for consistency
    if (Array.isArray(raw)) return { data: raw, total: raw.length, page, totalPages: 1 };
    return raw ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getToolBySlug(slug: string) {
    return apiFetch(`/tools/${slug}`, { next: { revalidate: 60 } });
}

export async function getCategories() {
    // Categories change rarely, cache for 5 minutes
    const data = await apiFetch('/categories', { next: { revalidate: 300 } });
    return Array.isArray(data) ? data : [];
}
