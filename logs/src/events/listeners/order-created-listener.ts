import { Listener, OrderCreatedEvent, Subjects } from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    console.log('OrderCreatedListener', data);

    msg.ack();
  }
}
