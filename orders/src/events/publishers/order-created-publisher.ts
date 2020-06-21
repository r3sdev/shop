import { Publisher, OrderCreatedEvent, Subjects } from '@ramsy-dev/microservices-shop-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}