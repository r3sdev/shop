import mongoose from 'mongoose';
import { ProductCreatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Message } from 'node-nats-streaming';
import { ProductCreatedListener } from '../product-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Create a listener instance
  const listener = new ProductCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: ProductCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    cost: 5,
    title: 'TestTitle',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a product', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert a product was created
  const product = await Product.findById(data.id);

  expect(product).toBeDefined();
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price);
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
