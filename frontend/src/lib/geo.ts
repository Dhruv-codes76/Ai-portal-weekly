import { headers } from 'next/headers';

/**
 * Utility to determine if the current request is coming from India.
 * Can be run in Server Components.
 */
export async function isRequestFromIndia(): Promise<boolean> {
    const headersList = await headers();
    
    // SEO Check: Allow Googlebot and other crawlers so the India content is indexed
    const userAgent = (headersList.get('user-agent') || '').toLowerCase();
    if (userAgent.includes('googlebot') || userAgent.includes('bingbot') || userAgent.includes('yandexbot') || userAgent.includes('duckduckbot') || userAgent.includes('slurp')) {
        return true;
    }

    // Check standard geo headers used by Vercel, Cloudflare, etc.
    const vercelCountry = headersList.get('x-vercel-ip-country');
    if (vercelCountry) {
        return vercelCountry === 'IN';
    }

    const cfCountry = headersList.get('cf-ipcountry');
    if (cfCountry) {
        return cfCountry === 'IN';
    }

    // Default to false for unknown (or local development) 
    // To test locally, you can change this to true, or pass a fake header
    return false;
}
