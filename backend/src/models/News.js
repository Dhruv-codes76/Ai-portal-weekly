const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  sourceLink: { type: String },
  tags: [{ type: String }],
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

module.exports = mongoose.model('News', newsSchema);
