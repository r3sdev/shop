import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {

    // TODO: Update products in carts 

    msg.ack();
  }
}
