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
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
const ticket_created_publisher_1 = require("./events/ticket-created-publisher");
console.clear();
const stan = node_nats_streaming_1.default.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});
stan.on("connect", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Publisher connected to NATS");
    try {
        yield new ticket_created_publisher_1.TicketCreatedPublisher(stan).publish({
            id: "123",
            title: "concert",
            price: 20,
        });
    }
    catch (err) {
        console.error(err);
    }
}));
