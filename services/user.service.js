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
exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findById(userId).select('-password');
});
exports.getUserById = getUserById;
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findByIdAndUpdate(userId, userData, { new: true, runValidators: true }).select('-password');
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findByIdAndDelete(userId);
});
exports.deleteUser = deleteUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.find().select('-password');
});
exports.getAllUsers = getAllUsers;
