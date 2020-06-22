import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/products for post requests', async () => {
  const response = await request(app).post('/api/products').send({});

  expect(response.status).not.toBe(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/products').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toBe(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'Title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'Title',
    })
    .expect(400);
});

it('creates a product with valid inputs', async () => {
  // Get all products
  let products = await Product.find({});

  expect(products).toHaveLength(0);

  const title = 'Title';
  const price = 20;

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  products = await Product.find({});
  expect(products).toHaveLength(1);
  expect(products[0].title).toEqual(title);
  expect(products[0].price).toEqual(price);
});

it('publishes an event', async () => {
  const title = 'Title';
  const price = 20;

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'product:created',
    expect.any(String),
    expect.any(Function),
  );
});
