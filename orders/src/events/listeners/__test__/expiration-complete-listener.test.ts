import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@ramsy-dev/microservices-shop-common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Test ticket',
    price: 10,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'userId',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { data, listener, order, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const { data, listener, order, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
});

it.todo('should not cancel orders already paid for')
