import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the product the order is reserving
    const product = await Product.findById(data.product.id);

    // If no product throw error
    if (!product) {
      throw new Error('Product not found');
    }

    // Mark the product as being reserved by setting its orderIt property
    product.set({ orderId: data.id });

    // Save the product
    await product.save();

    // Emit updated event
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      cost: product.cost,
      imageUrl: product.imageUrl,
      category: product.category
        ? {
            id: product.category.id,
            title: product.category.title,
          }
        : undefined,
      userId: product.userId,
      orderId: product.orderId,
      version: product.version,
    });

    // Acknowledge the message
    msg.ack();
  }
}
