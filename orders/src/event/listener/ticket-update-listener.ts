import { Listener, Subjects, TicketUpdatedEvent } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../db/TicketsModel";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdateListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;

    ticket.set({
      title,
      price,
    });

    await ticket.save();
  };
}
