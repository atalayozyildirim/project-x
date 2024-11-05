"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const setDB_1 = __importDefault(require("./config/setDB"));
const cookie_session_1 = __importDefault(require("cookie-session"));
(0, setDB_1.default)();
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", index_1.default);
app.use("*", (req, res) => {
    res.status(404).send("Page not found");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
