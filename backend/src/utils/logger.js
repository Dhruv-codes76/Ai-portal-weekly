const ActivityLog = require('../models/ActivityLog');

/**
 * Centrally log admin operations to the database
 * 
 * @param {Object} req - Express request object (used to extract IP and Admin user)
 * @param {String} action - Action performed (e.g., 'CREATE', 'UPDATE', 'DEACTIVATE', 'RESTORE', 'LOGIN')
 * @param {String} resource - The resource affected (e.g., 'News', 'Tool', 'Category', 'Admin')
 * @param {String} resourceId - The MongoDB ID of the affected resource (optional)
 * @param {Object} details - Any additional context or metadata (optional)
 */
const logActivity = async (req, action, resource, resourceId = null, details = {}) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // If it's a login, req.admin might not be set yet depending on where this is called
        // If it's a regular protected route, req.admin is set by auth middleware
        const adminId = req.admin ? req.admin._id : details.adminId;
        const adminEmail = req.admin ? req.admin.email || 'Unknown' : details.adminEmail || 'Unknown';

        const logEntry = new ActivityLog({
            adminId,
            adminEmail,
            action,
            resource,
            resourceId,
            details,
            ipAddress
        });

        await logEntry.save();
    } catch (error) {
        console.error('Failed to save activity log:', error.message);
    }
};

module.exports = { logActivity };
