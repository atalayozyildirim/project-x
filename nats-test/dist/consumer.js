"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
const crypto_1 = require("crypto");
const ticket_created_listener_1 = require("./events/ticket-created-listener");
console.clear();
const id = (0, crypto_1.randomBytes)(4).toString("hex");
const stan = node_nats_streaming_1.default.connect("ticketing", id, {
    url: "http://localhost:4222",
});
stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit(1);
});
stan.on("connect", () => {
    console.log("Consumer connected to NATS");
    new ticket_created_listener_1.TicketCreatedListener(stan).listen();
});
