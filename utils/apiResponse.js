"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = exports.UnauthorizedError = exports.ApiError = exports.sendTokenResponse = void 0;
const env_1 = require("../config/env");
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + env_1.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: env_1.NODE_ENV === 'production',
    };
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
        success: true,
        token,
    });
};
exports.sendTokenResponse = sendTokenResponse;
// Custom error class
class ApiError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Not authorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad Request', errors) {
        super(message, 400, errors);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
