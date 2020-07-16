import mongoose from 'mongoose';
import { ProductUpdatedEvent } from '@ramsy-dev/microservices-shop-common';
import { ProductUpdatedListener } from '../product-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Create a listener
  const listener = new ProductUpdatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Product',
    price: 10,
  });

  await product.save();

  // Create a fake data object
  const data: ProductUpdatedEvent['data'] = {
    id: product.id,
    version: product.version + 1,
    price: 11,
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

it('finds, updates and saves a product', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert a product was created
  const updatedProduct = await Product.findById(data.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow();

  // Assert ack function was not called
  expect(msg.ack).not.toHaveBeenCalled();
});
