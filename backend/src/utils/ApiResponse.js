/**
 * Enterprise API Response Utility
 * Ensures all successful responses follow the same JSON structure.
 */
class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data
        });
    }

    static success(res, data, message = 'Success', statusCode = 200) {
        return new ApiResponse(statusCode, data, message).send(res);
    }

    static created(res, data, message = 'Resource created successfully') {
        return new ApiResponse(201, data, message).send(res);
    }
}

module.exports = ApiResponse;
