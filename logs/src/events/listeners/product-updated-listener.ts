import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import {Event} from '../../../models/event';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {

    const event = Event.build({
      event: 'ProductUpdated',
      eventData: data,
      userId: data.userId
    });

    await event.save();

    console.log(event);

    // Acknowledge message
    msg.ack();
  }
}
