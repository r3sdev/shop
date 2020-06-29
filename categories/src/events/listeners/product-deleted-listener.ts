import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductDeletedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductDeletedEvent['data'], msg: Message) {
    // Find product with correct ID and version
    await Product.findByIdAndDelete(data.id);

    // Acknowledge message
    msg.ack();
  }
}
