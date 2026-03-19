const { z } = require('zod');

const createAdminSchema = z.object({
    body: z.object({
        email: z.string().email('Must be a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
});

const loginAdminSchema = z.object({
    body: z.object({
        email: z.string().email('Must be a valid email'),
        password: z.string().min(1, 'Password is required'),
    }),
});

module.exports = { createAdminSchema, loginAdminSchema };
