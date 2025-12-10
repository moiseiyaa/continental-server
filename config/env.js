"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN = exports.JWT_COOKIE_EXPIRE = exports.JWT_EXPIRE = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
exports.MONGODB_URI = process.env.MONGODB_URI || '';
exports.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
exports.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
exports.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE
    ? parseInt(process.env.JWT_COOKIE_EXPIRE, 10)
    : 30;
exports.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
