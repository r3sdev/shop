import {Message} from 'node-nats-streaming';
import {Subjects, Listener, ProductCreatedEvent} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'ProductCreated',
      eventData: data,
      userId: data.userId
    });

    await event.save();

    console.log(event);

    msg.ack();
  }
}