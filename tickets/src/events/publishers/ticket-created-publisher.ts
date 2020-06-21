import { Publisher, Subjects, TicketCreatedEvent } from '@ramsy-dev/microservices-shop-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;


}
