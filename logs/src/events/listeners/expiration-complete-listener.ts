import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    console.log('ExpirationCompleteListener', data);

    msg.ack();
  }
}
