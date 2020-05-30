import {Message} from 'node-nats-streaming';
import { PaymentCreatedEvent, Listener, Subjects, OrderStatus } from "@ramsy-it/common";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName = queueGroupName;
  
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    console.log('PaymentCreatedListener', data);

    msg.ack();
  }
}