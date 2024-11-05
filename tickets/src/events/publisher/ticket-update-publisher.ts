import { Publisher, Subjects, TicketUpdatedEvent } from "@sgtickets/common";

export class TicketUpdatedEvents extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
