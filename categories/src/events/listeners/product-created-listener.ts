import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price, imageUrl, category: _category } = data;

    const category = await Category.findById(_category?.id);

    if (!category) {
      throw new Error('Category not found')
    }

    const product = Product.build({ id, title, price, imageUrl, category });

    await product.save();

    if (category) {
      category.products?.push(product);

      await category.save();
    }

    msg.ack();
  }
}
