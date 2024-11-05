import nats from "node-nats-streaming";
import { Subject } from "./subject";

export interface TicketUpdateEvent {
  subject: Subject.TicketUpdate;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}
