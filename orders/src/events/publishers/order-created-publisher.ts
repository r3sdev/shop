import { Publisher, OrderCreatedEvent, Subjects } from '@ramsy-it/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}