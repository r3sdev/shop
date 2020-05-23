import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find order with corrent ID and version
    const order = await Order.findByEvent(data);

    // Throw error when no order is found
    if (!order) {
      throw new Error('Order not found');
    }

    // Cancel order
    order.set({ status: OrderStatus.Cancelled });

    // Save order
    await order.save();

    // Acknowledge message
    msg.ack();
  }
}
