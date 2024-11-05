"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthController = (req, res, next) => {
    try {
        // @ts-ignore
        const verify = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        if (verify) {
            req.body.user = verify;
            return next();
        }
    }
    catch (ex) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.AuthController = AuthController;
