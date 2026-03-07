const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { softDelete, restore } = require('../utils/softDelete');
const { logActivity } = require('../utils/logger');

// POST /api/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        console.log(`[AUTH] Login attempt for: ${email} from IP: ${ip}`);

        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log(`[AUTH] Failed login (User not found): ${email} from IP: ${ip}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (admin.status === 'inactive' || admin.isDeleted) {
            console.log(`[AUTH] Failed login (Inactive account): ${email} from IP: ${ip}`);
            return res.status(403).json({ error: 'Account has been deactivated. Contact super admin.' });
        }

        const validPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!validPassword) {
            console.log(`[AUTH] Failed login (Invalid password): ${email} from IP: ${ip}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log(`[AUTH] Successful login: ${email} from IP: ${ip}`);
        // Log the successful login manually since req.admin isn't set yet
        await logActivity(req, 'LOGIN', 'Admin', admin._id, { adminId: admin._id, adminEmail: admin.email });

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, email: admin.email, status: admin.status });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/admin/logout
const logoutAdmin = (req, res) => {
    res.json({ message: 'Logout successful. Please remove token from client storage.' });
};

// GET /api/admin (Protected)
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ isDeleted: false }).select('-passwordHash');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/admin (Protected)
const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: 'Admin with this email already exists' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ email, passwordHash, status: 'active' });
        await newAdmin.save();

        await logActivity(req, 'CREATE', 'Admin', newAdmin._id, { createdEmail: newAdmin.email });

        res.status(201).json({ message: 'Admin created successfully', email: newAdmin.email, status: newAdmin.status });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE /api/admin/:id (Protected) - Soft Delete (Deactivate)
const deactivateAdmin = async (req, res) => {
    if (req.admin._id === req.params.id) {
        return res.status(403).json({ error: 'Cannot deactivate your own admin account' });
    }
    return softDelete(req, Admin, req.params.id, res);
};

// PUT /api/admin/:id/restore (Protected) - Restore Admin
const restoreAdmin = async (req, res) => {
    return restore(req, Admin, req.params.id, res);
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    getAdmins,
    createAdmin,
    deactivateAdmin,
    restoreAdmin
};
