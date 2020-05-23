import { Publisher, PaymentCreatedEvent, Subjects } from "@ramsy-it/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}