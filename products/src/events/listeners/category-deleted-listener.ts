import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  CategoryDeletedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Category, CategoryDoc } from '../../models/category';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class CategoryDeletedListener extends Listener<CategoryDeletedEvent> {
  subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: CategoryDeletedEvent['data'], msg: Message) {
    // Find the to-be-deleted category
    const category = await Category.findById(data.id);

    // Throw an error when the category is not found
    if (!category) {
      throw new Error('Category not found');
    }

    // Find the uncategorized category
    const uncategorized = await Category.findOne({
      title: 'Uncategorized',
    });

    if (!uncategorized) {
      throw new Error('Uncategorized category not found');
    }

    // Assign uncategorized to all products assigned to to-be-deleted category
    // Save products
    await Product.updateMany(
      {
        category: category.id,
      },
      {
        $set: {
          category: uncategorized.id,
        },
      },
    );

    // Delete to-be-deleted category
    await Category.findByIdAndDelete(data.id);

    // Acknowledge message
    msg.ack();
  }
}
