const adminService = require('../services/adminService');
const { logActivity } = require('../utils/logger');
const { softDelete, restore } = require('../utils/softDelete');
const prisma = require('../config/prisma');

/**
 * Enterprise Admin Controller
 */

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, admin } = await adminService.login(email, password);
        
        // Log activity (Manual log since req.admin isn't set yet)
        await logActivity(req, 'LOGIN', 'Admin', admin.id, { adminId: admin.id, adminEmail: admin.email });

        res.json({ token, email: admin.email, status: admin.status });
    } catch (error) {
        next(error);
    }
};

const logoutAdmin = (req, res) => {
    res.json({ message: 'Logout successful. Please remove token from client storage.' });
};

const getAdmins = async (req, res, next) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.json(admins);
    } catch (error) {
        next(error);
    }
};

const createAdmin = async (req, res, next) => {
    try {
        const newAdmin = await adminService.createAdmin(req.body.email, req.body.password);
        await logActivity(req, 'CREATE', 'Admin', newAdmin.id, { createdEmail: newAdmin.email });

        res.status(201).json({ 
            message: 'Admin created successfully', 
            email: newAdmin.email, 
            status: newAdmin.status 
        });
    } catch (error) {
        next(error);
    }
};

const deactivateAdmin = async (req, res, next) => {
    try {
        await adminService.validateSelfDeactivation(req.params.id, req.admin ? req.admin.id : null);
        const doc = await softDelete(req, prisma.admin, 'Admin', req.params.id);
        res.json({ message: 'Admin deactivated successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

const restoreAdmin = async (req, res, next) => {
    try {
        const doc = await restore(req, prisma.admin, 'Admin', req.params.id);
        res.json({ message: 'Admin restored successfully', data: doc });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    getAdmins,
    createAdmin,
    deactivateAdmin,
    restoreAdmin
};
