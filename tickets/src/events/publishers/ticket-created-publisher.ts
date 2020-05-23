import { Publisher, Subjects, TicketCreatedEvent } from '@ramsy-it/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;


}
