import { Publisher, PaymentCreatedEvent, Subjects } from "@ramsy-dev/microservices-shop-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}