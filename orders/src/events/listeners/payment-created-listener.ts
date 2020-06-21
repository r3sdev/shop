import {Message} from 'node-nats-streaming';
import { PaymentCreatedEvent, Listener, Subjects, OrderStatus } from "@ramsy-dev/microservices-shop-common";
import { queueGroupName } from "./queue-group-name";
import {Order} from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName = queueGroupName;
  
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({
      status: OrderStatus.Complete
    })

    await order.save();

    // FIXME: Emit an order updated event here to notify other services

    msg.ack();
  }
}