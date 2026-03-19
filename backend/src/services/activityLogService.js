const prisma = require('../config/prisma');

/**
 * Enterprise Service for Activity Logging
 */
class ActivityLogService {
    async getLogs(options = {}) {
        const { page = 1, limit = 20, resource, action, adminEmail } = options;
        const skip = (page - 1) * limit;

        const filter = {};
        if (resource) filter.resource = resource;
        if (action) filter.action = action;
        if (adminEmail) filter.adminEmail = adminEmail;

        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.activityLog.count({ where: filter })
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}

module.exports = new ActivityLogService();
