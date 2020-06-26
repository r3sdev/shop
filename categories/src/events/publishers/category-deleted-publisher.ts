import {
  Publisher,
  Subjects,
  CategoryDeletedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class CategoryDeletedPublisher extends Publisher<CategoryDeletedEvent> {
  subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
}
