const { z } = require('zod');

/**
 * Zod schemas for News/Articles
 */
const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    slug: z.string().min(3, 'Slug is required'),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});

module.exports = {
  createNewsSchema,
};
