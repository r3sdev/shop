import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { queueGroupName } from './queue-group-name';
import { CategoryUpdatedPublisher } from '../publishers/category-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price, imageUrl, category: _category } = data;

    const category = await Category.findById(_category?.id);

    const product = Product.build({ id, title, price, imageUrl, category });

    await product.save();

    if (category) {
      category.products?.push(product);

      // This results in an update which needs to be emitted

      await category!.save();

      await new CategoryUpdatedPublisher(natsWrapper.client).publish({
        id: category.id,
        version: category.version,
        title: category.title,
        description: category.description,
        imageUrl: category.imageUrl,
      });
    }

    msg.ack();
  }
}
