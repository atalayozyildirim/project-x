import { Publisher, Subjects, OrderCancelledEvent } from "@sgtickets/common";

export class OrderCancelPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
