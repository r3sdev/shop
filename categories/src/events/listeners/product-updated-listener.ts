import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProductUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { queueGroupName } from './queue-group-name';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
    const { title, price, imageUrl, category: _category } = data;

    // Find product with correct ID and version
    const product = await Product.findByEvent(data);

    // Throw an error when the product is not found
    if (!product) {
      throw new Error('Product not found');
    }

    const oldCategory = await Category.findById(product?.category?.id);
    const newCategory = await Category.findById(_category?.id);

    // Update product
    product.set({ title, price, imageUrl, category: newCategory });

    // Save product
    await product.save();

    // Remove product from old category
    if (oldCategory) {
      // @ts-ignore
      oldCategory.products?.remove(product);
    }

    // Add product to new category
    if (newCategory) {
      newCategory.products?.push(product);

      await newCategory.save();
    }

    // Acknowledge message
    msg.ack();
  }
}
