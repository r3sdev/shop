import {
  Publisher,
  Subjects,
  ProductDeletedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
}
