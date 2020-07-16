import mongoose from 'mongoose';
import { ProductUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Message } from 'node-nats-streaming';
import { ProductUpdatedListener } from '../product-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Event } from '../../../../models/event';

const setup = async () => {
  // Create a listener instance
  const listener = new ProductUpdatedListener(natsWrapper.client);

  // Create a fake data event
  const data: ProductUpdatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    price: 50,
    cost: 25,
    title: 'Updated product',
    userId: 'testUserId',
    version: 1,
    orderId: 'orderId'
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
  expect(products[0].event).toEqual('ProductUpdated');
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
