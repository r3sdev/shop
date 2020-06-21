import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'TicketCreated',
      eventData: data,
      userId: data.userId
    });

    await event.save();

    console.log(event);

    msg.ack();
  }
}