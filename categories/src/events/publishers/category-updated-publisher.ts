import {
  Publisher,
  Subjects,
  CategoryUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class CategoryUpdatedPublisher extends Publisher<CategoryUpdatedEvent> {
  subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
}
