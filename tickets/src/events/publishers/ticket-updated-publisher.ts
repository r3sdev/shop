import { Publisher, Subjects, TicketUpdatedEvent } from '@ramsy-dev/microservices-shop-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
