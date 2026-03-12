const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    pricing: { type: String, enum: ['free', 'freemium', 'paid'], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String }],
    affiliateLink: { type: String },
    verified: { type: Boolean, default: false },
    seoMetaTitle: { type: String },
    seoMetaDescription: { type: String },
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    keywords: [{ type: String }],
    featuredImage: { type: String },
    featuredImageAlt: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Tool', toolSchema);
