import {
  Publisher,
  Subjects,
  ProductUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
