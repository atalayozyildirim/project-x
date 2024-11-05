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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../db/model/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const DataBaseConnectionError_1 = require("../../erorrs/DataBaseConnectionError");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    res.json({
        message: "Auth service running",
    });
});
// register router
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existing = yield User_1.User.findOne({ email });
        if (existing)
            throw new Error("User already exists");
        const user = new User_1.User({
            email,
            password,
        });
        yield user.save();
        res.status(201).send("User created successfully");
    }
    catch (error) {
        res.status(400).send("Internal server error " + error);
    }
}));
// login rotuer
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield User_1.User.findOne({ username });
        if (!existingUser)
            throw new Error("Invalid credentials");
        const isPassowrdValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPassowrdValid)
            throw new Error("Invalid credentials");
        const _token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
            email: existingUser.email,
        }, process.env.JWT_KEY);
        req.session.jwt = _token;
        console.log(req.session);
        res.status(200).json({
            message: "User logged in successfully",
        });
    }
    catch (error) {
        res.status(400).send("Internal server error " + error);
    }
}));
router.get("/logout", (_req, _res) => {
    throw new DataBaseConnectionError_1.DataBaseConnectionError();
});
exports.default = router;
