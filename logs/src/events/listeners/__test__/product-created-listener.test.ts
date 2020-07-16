import mongoose from 'mongoose';
import { ProductCreatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Message } from 'node-nats-streaming';
import { ProductCreatedListener } from '../product-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Event } from '../../../../models/event';

const setup = async () => {
  // Create a listener instance
  const listener = new ProductCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: ProductCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    cost: 10,
    title: 'Test product',
    userId: 'testUser',
    version: 0
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

  // Assert a product was created
  const products = await Event.find({});

  expect(products).toHaveLength(1);
  expect(products[0].event).toEqual('ProductCreated');
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
