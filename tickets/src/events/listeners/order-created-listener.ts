import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@ramsy-it/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderIt property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // Emit updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // Acknowledge the message
    msg.ack();
  }
}
