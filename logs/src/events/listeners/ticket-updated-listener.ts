import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'TicketUpdated',
      eventData: data,
      userId: data.userId
    });

    await event.save();

    console.log(event);

    // Acknowledge message
    msg.ack();
  }
}
