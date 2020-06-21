import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@ramsy-dev/microservices-shop-common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Mongoose } from 'mongoose';

const setup = async () => {
  // Create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);


  const orderId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'Test',
    price: 99,
    userId: 'testId',
  });

  // Set order ID
  ticket.set({orderId});

  await ticket.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
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

  expect(updateTicket?.orderId).toEqual(undefined);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
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
  expect(tickedUpdateData.orderId).toEqual(undefined);
});
