const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Enterprise Service for Admin Management and Auth
 */
class AdminService {
    async login(email, password) {
        const admin = await prisma.admin.findUnique({ where: { email } });
        
        if (!admin) throw new AppError('Invalid credentials', 400);

        if (admin.status === 'INACTIVE' || admin.isDeleted) {
            throw new AppError('Account has been deactivated. Contact super admin.', 403);
        }

        const validPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!validPassword) throw new AppError('Invalid credentials', 400);

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                status: admin.status
            }
        };
    }

    async getAllAdmins() {
        return await prisma.admin.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                email: true,
                status: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async createAdmin(email, password) {
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) throw new AppError('Admin with this email already exists', 400);

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        return await prisma.admin.create({
            data: {
                email,
                passwordHash,
                status: 'ACTIVE'
            }
        });
    }

    async validateSelfDeactivation(id, currentAdminId) {
        if (parseInt(id, 10) === currentAdminId) {
            throw new AppError('Cannot deactivate your own admin account', 403);
        }
    }
}

module.exports = new AdminService();
