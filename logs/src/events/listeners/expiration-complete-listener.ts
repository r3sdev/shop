import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import { Event } from '../../../models/event';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    
    const event = Event.build({
      event: 'ExpirationComplete',
      eventData: data,
    });

    await event.save();

    console.log(event)

    msg.ack();
  }
}
