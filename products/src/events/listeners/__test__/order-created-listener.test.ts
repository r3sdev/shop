import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ramsy-dev/microservices-shop-common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';
import { Mongoose } from 'mongoose';

const setup = async () => {
  // Create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    title: 'Test',
    price: 99,
    userId: 'testId',
  });

  await product.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    expiresAt: new Date().toISOString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    product: {
      id: product.id,
      price: product.price,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, data, msg };
};

it('sets the orderId of the product', async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updateProduct = await Product.findById(product.id);

  expect(updateProduct?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, product, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a product updated event', async () => {
  const { listener, product, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'product:updated',
    expect.any(String),
    expect.any(Function),
  );

  const productUpdateEvent = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][0];
  expect(productUpdateEvent).toEqual('product:updated');

  const productUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(data.id).toEqual(productUpdateData.orderId);
});
