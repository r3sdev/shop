import { Publisher, OrderCancelledEvent, Subjects } from '@ramsy-it/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
