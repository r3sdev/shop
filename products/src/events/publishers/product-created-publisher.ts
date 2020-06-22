import {
  Publisher,
  Subjects,
  ProductCreatedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
