const AppError = require('../utils/AppError');

/**
 * Enterprise Global Error Handler
 * Handles Prisma-specific, JWT, and generic errors.
 */

// Prisma unique constraint violation (e.g. duplicate slug/email)
const handlePrismaUniqueConstraint = (err) => {
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`Duplicate value for '${field}'. Please use a different value.`, 400);
};

// Prisma record not found
const handlePrismaNotFound = () => new AppError('Record not found.', 404);

// JWT errors
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

// Dev: send full error details
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Prod: only send safe messages
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } else {
        console.error('UNHANDLED ERROR 💥', err);
        res.status(500).json({
            success: false,
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = Object.create(err);
        error.message = err.message;

        // Prisma errors
        if (error.code === 'P2002') error = handlePrismaUniqueConstraint(error);
        if (error.code === 'P2025') error = handlePrismaNotFound();

        // JWT errors
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
