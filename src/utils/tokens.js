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
exports.verifyToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';
// Generate access token
const generateAccessToken = (userId) => {
    const payload = { userId };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token
const generateRefreshToken = (userId) => {
    const payload = { userId };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET);
};
exports.generateRefreshToken = generateRefreshToken;
// Verify access token
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        return err;
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Verify access token
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.token = decoded;
        next();
    }
    catch (err) {
        res.status(401).send('Please authenticate');
    }
});
exports.verifyToken = verifyToken;
