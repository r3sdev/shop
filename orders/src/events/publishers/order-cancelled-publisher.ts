import { Publisher, OrderCancelledEvent, Subjects } from '@ramsy-dev/microservices-shop-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
