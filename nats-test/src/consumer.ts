import nast, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();
const id = randomBytes(4).toString("hex");

const stan = nast.connect("ticketing", id, {
  url: "http://localhost:4222",
});

stan.on("close", () => {
  console.log("NATS connection closed!");
  process.exit(1);
});
stan.on("connect", () => {
  console.log("Consumer connected to NATS");

  new TicketCreatedListener(stan).listen();
});
