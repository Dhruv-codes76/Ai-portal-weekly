const { logActivity } = require('./logger');
const AppError = require('./AppError');

/**
 * Enterprise Soft-Delete Utility
 * No longer controls HTTP response — returns data for the controller to handle.
 */
const softDelete = async (req, prismaModel, modelName, id) => {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new AppError(`Invalid ${modelName} ID`, 400);

    try {
        const doc = await prismaModel.update({
            where: { id: parsedId },
            data: { isDeleted: true }
        });
        await logActivity(req, 'DEACTIVATE', modelName, doc.id.toString());
        return doc;
    } catch (err) {
        if (err.code === 'P2025') throw new AppError(`${modelName} not found`, 404);
        throw err;
    }
};

const restore = async (req, prismaModel, modelName, id) => {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new AppError(`Invalid ${modelName} ID`, 400);

    try {
        const doc = await prismaModel.update({
            where: { id: parsedId },
            data: { isDeleted: false }
        });
        await logActivity(req, 'RESTORE', modelName, doc.id.toString());
        return doc;
    } catch (err) {
        if (err.code === 'P2025') throw new AppError(`${modelName} not found`, 404);
        throw err;
    }
};

module.exports = { softDelete, restore };
