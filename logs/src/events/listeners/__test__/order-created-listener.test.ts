import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Event } from '../../../../models/event';

const setup = async () => {
  // Create a listener instance
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: (new Date().getSeconds() + 60).toString(),
    status: OrderStatus.Created,
    ticket: {
      id: 'test',
      price: 20
    },
    userId: 'test',
    version: 0,
  
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('saves the event', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert a ticket was created
  const tickets = await Event.find({});

  expect(tickets).toHaveLength(1);
  expect(tickets[0].event).toEqual('OrderCreated');
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
