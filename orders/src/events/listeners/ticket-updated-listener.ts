import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // Find ticket with corrent ID and version
    const ticket = await Ticket.findByEvent(data);

    // Throw an error when the ticket is not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Update ticket
    ticket.set({ title: data.title, price: data.price });

    // Save ticket
    await ticket.save();

    // Acknowledge message
    msg.ack();
  }
}
