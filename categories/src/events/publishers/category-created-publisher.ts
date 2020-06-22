import {
  Publisher,
  Subjects,
  CategoryCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class CategoryCreatedPublisher extends Publisher<CategoryCreatedEvent> {
  subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
}
