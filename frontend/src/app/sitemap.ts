/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
export const dynamic = 'force-dynamic';
import { getNews, getTools } from '@/lib/api';

/**
 * SEO Hardening: Metadata-Driven Sitemap Logic (Flattened)
 * Goal: Protect Domain Authority by provided a single, high-performance sitemap.
 * Rule: Only update <lastmod> when content actually changes.
 */

// Critical: Use a fixed date for static structural pages. 
const LAST_STATIC_UPDATE = new Date('2026-04-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.aiportalweekly.com';
    
    // 1. Static Routes Mapping
    const baseUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(), // Homepage is truly dynamic
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: LAST_STATIC_UPDATE, 
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: LAST_STATIC_UPDATE,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: LAST_STATIC_UPDATE,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: LAST_STATIC_UPDATE,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: LAST_STATIC_UPDATE,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    let newsUrls: MetadataRoute.Sitemap = [];
    let toolsUrls: MetadataRoute.Sitemap = [];

    // 2. Fetch News with Error Isolation
    try {
        const newsData = await getNews(1, 1000);
        if (newsData && Array.isArray(newsData.data)) {
            newsUrls = newsData.data.map((article: any) => ({
                url: `${baseUrl}/news/${article.slug}`,
                lastModified: new Date(article.updatedAt || article.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error('Sitemap Error (News):', error);
    }

    // 3. Fetch Tools with Error Isolation
    try {
        const toolsData = await getTools(1, 1000);
        if (toolsData && Array.isArray(toolsData.data)) {
            toolsUrls = toolsData.data.map((tool: any) => ({
                url: `${baseUrl}/tools/${tool.slug}`,
                lastModified: new Date(tool.updatedAt || tool.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error('Sitemap Error (Tools):', error);
    }

    // Combine into a single comprehensive sitemap
    return [...baseUrls, ...newsUrls, ...toolsUrls];
}


