const { z } = require('zod');

const createToolSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Tool name must be at least 3 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        slug: z.string().min(3, 'Slug is required'),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        pricing: z.enum(['FREE', 'FREEMIUM', 'PAID']).optional(),
    }),
});

module.exports = { createToolSchema };
