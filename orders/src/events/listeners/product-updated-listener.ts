import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
    // Find product with correct ID and version
    const product = await Product.findByEvent(data);

    // Throw an error when the product is not found
    if (!product) {
      throw new Error('Product not found');
    }

    // Update product
    product.set({ title: data.title, price: data.price });

    // Save product
    await product.save();

    // Acknowledge message
    msg.ack();
  }
}
