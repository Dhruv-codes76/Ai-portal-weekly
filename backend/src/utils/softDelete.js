const { logActivity } = require('./logger');

const softDelete = async (req, Model, id, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });

        await logActivity(req, 'DEACTIVATE', Model.modelName, doc._id);
        res.json({ message: `${Model.modelName} deleted successfully`, data: doc });
    } catch (error) {
        res.status(500).json({ error: 'Server error during soft delete' });
    }
};

const restore = async (req, Model, id, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });

        await logActivity(req, 'RESTORE', Model.modelName, doc._id);
        res.json({ message: `${Model.modelName} restored successfully`, data: doc });
    } catch (error) {
        res.status(500).json({ error: 'Server error during restore' });
    }
};

module.exports = { softDelete, restore };
