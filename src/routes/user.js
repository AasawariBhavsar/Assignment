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
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const tokens_1 = require("../utils/tokens");
const tokens_2 = require("../utils/tokens");
const router = (0, express_1.Router)();
// Delete user
router.delete('/:id', tokens_2.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        // Check if the user exists
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete the user
        yield User_1.default.findByIdAndDelete(userId);
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Refresh access token
router.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        // Verify the refresh token
        const decoded = (0, tokens_1.verifyAccessToken)(refreshToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        // Generate a new access token
        const accessToken = (0, tokens_1.generateAccessToken)(decoded.userId);
        res.json({ accessToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
