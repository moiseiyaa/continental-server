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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const apiResponse_1 = require("../utils/apiResponse");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, role } = req.body;
        const { user, token } = yield (0, auth_service_1.register)({ name, email, password, role });
        (0, apiResponse_1.sendTokenResponse)(user, 201, res);
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const { user, token } = yield (0, auth_service_1.login)(email, password);
        (0, apiResponse_1.sendTokenResponse)(user, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.getMe)(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrentUser = getCurrentUser;
