import { Listener, OrderCreatedEvent, Subjects } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "payment-service";

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      price: data.ticket.price,
      userId: data.userId,
    });

    console.log("Order created event data", data);
    await order.save();

    msg.ack();
  }
}
