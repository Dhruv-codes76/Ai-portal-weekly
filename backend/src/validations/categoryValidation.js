const { z } = require('zod');

const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Category name must be at least 2 characters'),
        slug: z.string().min(2, 'Slug is required'),
    }),
});

module.exports = { createCategorySchema };
