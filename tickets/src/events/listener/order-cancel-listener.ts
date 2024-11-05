import { Listener, OrderCancelledEvent, Subjects } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group";
import { TicketUpdatedEvents } from "../publisher/ticket-update-publisher";
import { Ticket } from "../../db/tickets";

export class OrderCancellListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: Subjects.OrderCancelled });

    await ticket.save();

    // publish an event that ticket has been updated

    await new TicketUpdatedEvents(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
