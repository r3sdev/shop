import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    console.log('OrderCancelledListener', data);

    // Acknowledge message
    msg.ack();
  }
}
