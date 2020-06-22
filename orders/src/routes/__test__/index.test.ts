import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';

const buildProduct = async (title: string, price: number) => {
  const product = Product.build({
    title,
    price,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await product.save();

  return product;
};

it('fetches orders for a particular user', async () => {
  // Create three products via the product model
  const productOne = await buildProduct('First product', 10);
  const productTwo = await buildProduct('Second product', 20);
  const productThree = await buildProduct('Third product', 30);

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ productId: productOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: productTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: productThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Assert we only get orders for User #2
  expect(response.body).toHaveLength(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);

  expect(response.body[0].product.id).toEqual(productTwo.id);
  expect(response.body[1].product.id).toEqual(productThree.id);
});
