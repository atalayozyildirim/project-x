import { Publisher, Subjects, OrderCreatedEvent } from "@sgtickets/common";

export class OrderCreatedEventPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
