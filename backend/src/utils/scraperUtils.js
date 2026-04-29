const axios = require('axios');
const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-url')()
]);
// We'll also use a simple regex to extract raw text content from the body
// For a production app, cheerio or jsdom is better, but doing a basic regex for text extraction helps keep dependencies low.
const cheerio = require('cheerio'); // Need to check if cheerio is available, if not, we'll install it or use regex.

async function scrapeUrlContent(targetUrl) {
    try {
        const { data: html, request } = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000 // 10s timeout
        });
        
        const finalUrl = request.res.responseUrl || targetUrl;
        const metadata = await metascraper({ html, url: finalUrl });
        
        let textContent = '';
        try {
            // Attempt cheerio if installed, fallback to basic tag stripping
            const ch = require('cheerio');
            const $ = ch.load(html);
            // Remove script and style tags
            $('script, style, nav, footer, header, aside').remove();
            textContent = $('body').text().replace(/\s+/g, ' ').trim();
        } catch(e) {
            // Strip HTML tags using regex if cheerio is missing
            textContent = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                              .replace(/<[^>]+>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();
        }
        
        // Take up to the first 15,000 characters to prevent huge token usage
        textContent = textContent.slice(0, 15000);

        return {
            title: metadata.title || '',
            description: metadata.description || '',
            image: metadata.image || '',
            url: finalUrl,
            text: textContent
        };
    } catch (error) {
        console.error("Scraping error:", error);
        throw new Error("Failed to fetch or parse the URL.");
    }
}

module.exports = { scrapeUrlContent };
