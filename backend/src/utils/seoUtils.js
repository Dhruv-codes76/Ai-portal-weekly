/**
 * Generates SEO metadata if fields are left blank.
 * @param {Object} doc - The document (News or Tool)
 * @param {String} type - 'news' or 'tool'
 */
const generateSEO = (doc, type) => {
    const title = doc.title || doc.name;
    const summary = doc.summary || doc.description;

    if (!doc.seoMetaTitle) doc.seoMetaTitle = title;
    if (!doc.seoMetaDescription) doc.seoMetaDescription = summary?.substring(0, 160);
    
    // Social defaults
    if (!doc.ogTitle) doc.ogTitle = doc.seoMetaTitle;
    if (!doc.ogDescription) doc.ogDescription = doc.seoMetaDescription;
    if (!doc.twitterTitle) doc.twitterTitle = doc.seoMetaTitle;
    if (!doc.twitterDescription) doc.twitterDescription = doc.seoMetaDescription;

    // Default canonical (absolute URL depends on environment, handled in frontend usually, but stored if custom)
    // Here we just ensure we don't have nulls if we want strict schema
    
    return doc;
};

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

module.exports = { generateSEO, slugify };
