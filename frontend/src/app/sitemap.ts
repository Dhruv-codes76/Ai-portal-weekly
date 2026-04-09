/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
export const dynamic = 'force-dynamic';
import { getNews, getTools } from '@/lib/api';

/**
 * SEO Hardening: Metadata-Driven Sitemap Logic
 * Goal: Protect Domain Authority by using verifiable database timestamps.
 * Rule: Only update <lastmod> when content actually changes.
 */

// Critical: Use a fixed date for static structural pages. 
// ONLY update this manually if you change the content of /about or /privacy.
const LAST_STATIC_UPDATE = new Date('2026-04-01');

export async function generateSitemaps() {
    return [
        { id: 'static' },
        { id: 'news' },
        { id: 'tools' },
    ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.aiportalweekly.com';
    
    // Manual-First Static Mapping
    const baseUrls = [
        {
            url: baseUrl,
            lastModified: new Date(), // Homepage is truly dynamic (latest news)
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(), // Listings surface newest posts daily
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(), // Tools directory updates frequently
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: LAST_STATIC_UPDATE, 
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: LAST_STATIC_UPDATE,
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
    ];

    try {
        if (id === 'news') {
            const newsData = await getNews(1, 1000);
            return Array.isArray(newsData.data) ? newsData.data.map((article: any) => ({
                url: `${baseUrl}/news/${article.slug}`,
                // Honest Timestamp: Prioritize real edit date, then publish date
                lastModified: new Date(article.updatedAt || article.createdAt || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })) : [];
        }

        if (id === 'tools') {
            const toolsData = await getTools(1, 1000);
            return Array.isArray(toolsData.data) ? toolsData.data.map((tool: any) => ({
                url: `${baseUrl}/tools/${tool.slug}`,
                // Honest Timestamp: Prioritize real edit date
                lastModified: new Date(tool.updatedAt || tool.createdAt || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })) : [];
        }

        // Default to static mapping
        return baseUrls;
    } catch (error) {
        console.error(`Network error generating sitemap for ID ${id}:`, error);
        return id === 'static' ? baseUrls : [];
    }
}


