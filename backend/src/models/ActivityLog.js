const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "CREATE", "UPDATE", "DEACTIVATE", "RESTORE", "LOGIN"
    resource: { type: String, required: true }, // e.g. "News", "Tool", "Category", "Admin"
    resourceId: { type: mongoose.Schema.Types.ObjectId }, // ID of the affected document
    details: { type: Object }, // Additional metadata, old/new values, etc.
    ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
