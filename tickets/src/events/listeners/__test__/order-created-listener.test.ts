import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ramsy-dev/microservices-shop-common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Mongoose } from 'mongoose';

const setup = async () => {
  // Create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'Test',
    price: 99,
    userId: 'testId',
  });

  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    expiresAt: new Date().toISOString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'ticket:updated',
    expect.any(String),
    expect.any(Function),
  );

  const tickedUpdateEvent = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][0];
  expect(tickedUpdateEvent).toEqual('ticket:updated');

  const tickedUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(data.id).toEqual(tickedUpdateData.orderId);
});
