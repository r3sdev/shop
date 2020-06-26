import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@ramsy-dev/microservices-shop-common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { Mongoose } from 'mongoose';

const setup = async () => {
  // Create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();
  const orderId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a product
  const product = Product.build({
    title: 'Test',
    price: 99,
    cost: 50,
    category,
    userId: 'testId',
  });

  // Set order ID
  product.set({ orderId });

  await product.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    product: {
      id: product.id,
    },
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

  expect(updateProduct?.orderId).toEqual(undefined);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a product updated event', async () => {
  const { listener, data, msg } = await setup();
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
  expect(productUpdateData.orderId).toEqual(undefined);
});
