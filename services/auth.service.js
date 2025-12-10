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
exports.getMe = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create(userData);
    const token = user.getSignedJwtToken();
    return { user, token };
});
exports.register = register;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }
    // Check if password matches
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = user.getSignedJwtToken();
    return { user, token };
});
exports.login = login;
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findById(userId).select('-password');
});
exports.getMe = getMe;
