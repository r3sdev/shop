import { Publisher, Subjects, TicketUpdatedEvent } from '@ramsy-it/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
