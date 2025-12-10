"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const env_1 = require("../config/env");
const apiError_1 = require("../utils/apiError");
// Protect routes
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new apiError_1.UnauthorizedError('Not authorized to access this route'));
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = yield user_model_1.default.findById(decoded.id).select('-password');
        next();
    }
    catch (err) {
        return next(new apiError_1.UnauthorizedError('Not authorized to access this route'));
    }
});
exports.protect = protect;
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new apiError_1.UnauthorizedError(`User role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;
