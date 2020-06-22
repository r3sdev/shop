import mongoose from 'mongoose';
import {OrderStatus} from '@ramsy-dev/microservices-shop-common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Product } from '../../models/product';

/* This is already mocked */
import { natsWrapper } from '../../nats-wrapper';

it.todo('should check if user is authenticated');

it.todo('should have a valid product id');

it('returns an error if the product does not exist', async () => {
  const productId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId })
    .expect(404);
});

it('returns an error if the product is already reserved', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test product',
  });

  await product.save();

  const order = Order.build({
    product,
    userId: 'testUderId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId: product.id })
    .expect(400);
});

it('reserves a product', async () => {
  // Check there are no orders in the database
  expect(await Order.find({})).toHaveLength(0);

  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test product',
  });

  await product.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId: product.id })
    .expect(201);

  // Check if the order is returned
  expect(response.body.status).toEqual('created');

  // Check an order is created in the database
  const orders = await Order.find({});
  expect(orders).toHaveLength(1);
  expect(orders[0].status).toEqual('created');

  // Check if the products match
  expect(orders[0].product.id.toString('hex')).toEqual(product.id);
});

it('emit an order created event', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test product',
  });

  await product.save();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'order:created',
    expect.stringContaining(order.id),
    expect.any(Function),
  );
});
