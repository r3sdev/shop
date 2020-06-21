import { Message } from 'node-nats-streaming';
import {
  PaymentCreatedEvent,
  Listener,
  Subjects,
  OrderStatus,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'PaymentCreated',
      eventData: data,
    });

    await event.save();

    console.log(event);

    msg.ack();
  }
}
