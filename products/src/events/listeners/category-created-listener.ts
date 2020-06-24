import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  CategoryCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../../models/category';
import { queueGroupName } from './queue-group-name';

export class CategoryCreatedListener extends Listener<CategoryCreatedEvent> {
  subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CategoryCreatedEvent['data'], msg: Message) {
    const { id, title, description, imageUrl } = data;
    const product = Category.build({ id, title, description, imageUrl });

    await product.save();

    msg.ack();
  }
}
