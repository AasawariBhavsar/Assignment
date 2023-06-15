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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const tokens_1 = require("../utils/tokens");
const router = (0, express_1.Router)();
// User signup
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if email already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Create a new user
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({ email, password: hashedPassword });
        yield newUser.save();
        res.json({ message: 'Signup successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// User login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Verify password
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate access token and refresh token
        const accessToken = (0, tokens_1.generateAccessToken)(user._id);
        const refreshToken = (0, tokens_1.generateRefreshToken)(user._id);
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
