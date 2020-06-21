import { Listener, OrderCreatedEvent, Subjects } from '@ramsy-dev/microservices-shop-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Event } from '../../../models/event';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'OrderCreated',
      eventData: data,
      userId: data.userId,
    });

    await event.save();

    console.log(event);

    msg.ack();
  }
}
