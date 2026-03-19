const { z } = require('zod');

/**
 * Zod schemas for News/Articles
 * NOTE: Multipart form data sends all values as strings.
 * We only validate the truly required fields and allow all other fields through.
 */
const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    slug: z.string().min(3, 'Slug is required'),
    summary: z.string().min(10, 'Summary must be at least 10 characters'),
    content: z.string().min(10, 'Content is required'),
  }).passthrough(), // allow extra fields (tags, SEO fields, etc.)
});

module.exports = {
  createNewsSchema,
};
