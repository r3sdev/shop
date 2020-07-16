import {
  Publisher,
  Subjects,
  CartUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';

export class CartUpdatedPublisher extends Publisher<CartUpdatedEvent> {
  subject: Subjects.CartUpdated = Subjects.CartUpdated;
}
