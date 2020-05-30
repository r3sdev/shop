import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: TicketCreatedEvent['data'], msg: Message, requestIp) {
    console.log('TicketCreatedListener', { data, requestIp });

    msg.ack();
  }
}