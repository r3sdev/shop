import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  CategoryUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../../models/category';
import { queueGroupName } from './queue-group-name';

export class CategoryUpdatedListener extends Listener<CategoryUpdatedEvent> {
  subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CategoryUpdatedEvent['data'], msg: Message) {
    // Find product with correct ID and version
    const category = await Category.findByEvent(data);

    // Throw an error when the product is not found
    if (!category) {
      throw new Error('Category not found');
    }

    // Update product
    category.set({ 
      title: data.title, 
      description: data.description,
      imageUrl: data.imageUrl
     });

    // Save product
    await category.save();

    // Acknowledge message
    msg.ack();
  }
}
