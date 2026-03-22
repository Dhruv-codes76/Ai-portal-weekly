/**
 * Readability Utilities for CRM
 * Enforces Yoast-style readability rules: 
 * - Passive Voice < 10%
 * - Transition Word Density 25-30%
 */

const transitionWords = [
    "accordingly", "as a result", "consequently", "for this reason", "hence", "therefore", "thus",
    "additionally", "also", "furthermore", "in addition", "moreover", "equally important",
    "by comparison", "conversely", "however", "on the other hand", "similarly", "whereas",
    "for example", "for instance", "to illustrate",
    "afterward", "eventually", "meanwhile", "next", "then", "until",
    "primarily", "chiefly", "above all",
    "first", "second", "third", "finally", "lastly"
];

// Simplified passive voice detection: looking for form of "to be" + past participle
// Forms of "to be": am, is, are, was, were, be, being, been
// Past participles usually end in "ed", "en", "t" (heuristic)
const toBeVerbs = ["am", "is", "are", "was", "were", "be", "being", "been"];

export interface ReadabilityResults {
    passiveVoicePercentage: number;
    transitionDensityPercentage: number;
    wordCount: number;
    sentenceCount: number;
    keywordDensity: number;
    keywordInIntro: boolean;
    keywordInTitle: boolean;
    keywordInSlug: boolean;
    keywordInMeta: boolean;
    keywordInH2: boolean;
    keywordInConclusion: boolean;
    keywordInImageAlt: boolean;
    hasLongParagraphs: boolean;
    consecutiveSentenceStarts: number;
    externalLinkCount: number;
    internalLinkCount: number;
}

interface AnalysisContext {
    content: string;
    keyphrase: string;
    title?: string;
    slug?: string;
    metaDescription?: string;
    imageAlt?: string;
}

export function analyzeReadability({
    content,
    keyphrase,
    title,
    slug,
    metaDescription,
    imageAlt
}: AnalysisContext): ReadabilityResults {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const key = keyphrase?.toLowerCase().trim();

    const baseResults: ReadabilityResults = {
        passiveVoicePercentage: 0,
        transitionDensityPercentage: 0,
        wordCount: 0,
        sentenceCount: 0,
        keywordDensity: 0,
        keywordInIntro: false,
        keywordInTitle: false,
        keywordInSlug: false,
        keywordInMeta: false,
        keywordInH2: false,
        keywordInConclusion: false,
        keywordInImageAlt: false,
        hasLongParagraphs: false,
        consecutiveSentenceStarts: 0,
        externalLinkCount: 0,
        internalLinkCount: 0
    };

    if (!text) return baseResults;

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;

    if (wordCount === 0) return baseResults;

    // 1. Transition Word Density
    let transitionCount = 0;
    const textLower = text.toLowerCase();
    transitionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = textLower.match(regex);
        if (matches) transitionCount += matches.length;
    });
    
    const transitionDensityPercentage = (transitionCount / sentenceCount) * 100;

    // 2. Passive Voice (Basic Heuristic)
    let passiveCount = 0;
    sentences.forEach(sentence => {
        const s = sentence.toLowerCase();
        toBeVerbs.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\s+\\w+(ed|en|t)\\b`, 'g');
            const matches = s.match(regex);
            if (matches) passiveCount += matches.length;
        });
    });

    const passiveVoicePercentage = (passiveCount / sentenceCount) * 100;

    // 3. Keyword Specifics (Yoast-style)
    if (key) {
        // Density calculation
        const keyWords = key.split(' ');
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        const matches = textLower.match(regex);
        const density = matches ? (matches.length / wordCount) * 100 : 0;
        
        baseResults.keywordDensity = Number(density.toFixed(2));

        // Placement checks
        const first100Words = words.slice(0, 100).join(' ');
        baseResults.keywordInIntro = first100Words.includes(key);
        baseResults.keywordInTitle = title?.toLowerCase().includes(key) || false;
        baseResults.keywordInSlug = slug?.toLowerCase().includes(key.replace(/\s+/g, '-')) || false;
        baseResults.keywordInMeta = metaDescription?.toLowerCase().includes(key) || false;

        // E-SHIELD SEO Rules
        const h2Matches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
        if (h2Matches) {
            baseResults.keywordInH2 = h2Matches.some(h2 => h2.toLowerCase().includes(key));
        }

        const last150Words = words.slice(-150).join(' ');
        baseResults.keywordInConclusion = last150Words.includes(key);

        if (imageAlt?.toLowerCase().includes(key)) {
            baseResults.keywordInImageAlt = true;
        } else {
            const imgMatches = content.match(/<img[^>]+alt=["']([^"']+)["']/gi);
            if (imgMatches) {
                 baseResults.keywordInImageAlt = imgMatches.some(img => {
                     const altMatch = img.match(/alt=["']([^"']+)["']/i);
                     return altMatch && altMatch[1].toLowerCase().includes(key);
                 });
            }
        }
    }

    // 4. Consecutive Sentences
    let maxConsecutiveStarts = 0;
    let currentConsecutiveStarts = 1;
    let lastStartWord = "";

    sentences.forEach(sentence => {
        const s = sentence.trim();
        if (!s) return;
        const firstWordMatch = s.toLowerCase().match(/^\b\w+\b/);
        if (firstWordMatch) {
            const firstWord = firstWordMatch[0];
            if (firstWord === lastStartWord && firstWord !== "") {
                currentConsecutiveStarts++;
                maxConsecutiveStarts = Math.max(maxConsecutiveStarts, currentConsecutiveStarts);
            } else {
                currentConsecutiveStarts = 1;
                lastStartWord = firstWord;
            }
        }
    });
    baseResults.consecutiveSentenceStarts = maxConsecutiveStarts;

    // 5. Long Paragraphs (Max 150 words)
    const pMatches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (pMatches) {
        pMatches.forEach(p => {
            const pText = p.replace(/<[^>]*>/g, ' ').trim();
            const pWords = pText.match(/\b\w+\b/g) || [];
            if (pWords.length > 150) {
                baseResults.hasLongParagraphs = true;
            }
        });
    }

    // 6. Links (Internal vs External)
    const aMatches = content.match(/<a[^>]+href=["']([^"']+)["']/gi);
    if (aMatches) {
        aMatches.forEach(a => {
            const hrefMatch = a.match(/href=["']([^"']+)["']/i);
            if (hrefMatch && hrefMatch[1]) {
                const url = hrefMatch[1];
                if (url.startsWith('http') && !url.includes('aiportal') && !url.includes('localhost')) {
                    baseResults.externalLinkCount++;
                } else if (url.startsWith('/') || url.includes('aiportal') || url.includes('localhost')) {
                    baseResults.internalLinkCount++;
                }
            }
        });
    }

    return {
        ...baseResults,
        passiveVoicePercentage: Math.round(passiveVoicePercentage),
        transitionDensityPercentage: Math.round(transitionDensityPercentage),
        wordCount,
        sentenceCount
    };
}
