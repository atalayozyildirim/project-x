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
const cookie_session_1 = __importDefault(require("cookie-session"));
const ConnectDatabase_1 = require("./config/ConnectDatabase");
const router_1 = __importDefault(require("./router"));
const nats_wrapper_1 = require("./nats-wrapper");
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
}));
app.use("/", router_1.default);
app.use("*", (req, res) => {
    res.send("404 Not Found");
});
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI must be defined");
        }
        console.log("Server running on port 3000");
        yield nats_wrapper_1.natsWrapper.connect("ticketing", "ticketing-client", process.env.NATS_URL);
        nats_wrapper_1.natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });
        process.on("SIGINT", () => nats_wrapper_1.natsWrapper.client.close());
        process.on("SIGTERM", () => nats_wrapper_1.natsWrapper.client.close());
        yield (0, ConnectDatabase_1.connectDatabase)();
    }
    catch (error) {
        console.log("Error connecting to database", error);
    }
}));
