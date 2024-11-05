"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const setDB_1 = __importDefault(require("./config/setDB"));
const express_session_1 = __importDefault(require("express-session"));
(0, setDB_1.default)();
const app = (0, express_1.default)();
exports.app = app;
if (!process.env.jwt) {
    console.error("JWT secret is not defined");
    process.env.jwt = "asdf";
    // process.exit(1);
}
app.set("trust proxy", true);
app.use((0, express_session_1.default)({
    secret: process.env.jwt,
    resave: false, // Add resave option
    saveUninitialized: false, // Add saveUninitialized option
    cookie: { secure: true },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", index_1.default);
app.use("*", (req, res) => {
    res.status(404).send("Page not found");
});
