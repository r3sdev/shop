import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductDeletedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductDeletedEvent['data'], msg: Message) {

    // TODO: Delete products in carts 

    msg.ack();
  }
}
