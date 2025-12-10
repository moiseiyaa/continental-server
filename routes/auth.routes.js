"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    (0, express_validator_1.body)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], auth_controller_1.registerUser);
// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', [
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Password is required').exists(),
], auth_controller_1.loginUser);
// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth_middleware_1.protect, auth_controller_1.getCurrentUser);
exports.default = router;
