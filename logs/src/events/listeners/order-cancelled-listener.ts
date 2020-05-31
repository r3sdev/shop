import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'OrderCancelled',
      eventData: data,
    });

    await event.save();

    // Acknowledge message
    msg.ack();
  }
}
