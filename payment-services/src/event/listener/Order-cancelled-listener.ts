import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";

export class OrderCancelledEvents extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = "payment-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
