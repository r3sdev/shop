import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/products for post requests', async () => {
  const response = await request(app).post('/api/products').send({});

  expect(response.status).not.toBe(404);
});

it('can only be accessed if the user is an admin', async () => {
  await request(app).post('/api/products').send({}).expect(401);
});

it('returns a status other than 401 if the user is an admin', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({});

  expect(response.status).not.toBe(401);
});

it('returns an error if an invalid title is provided', async () => {
  const cookie = global.signin({ isAdmin: true });
  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = global.signin({ isAdmin: true });

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'Title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'Title',
    })
    .expect(400);
});

it('creates a product with valid inputs', async () => {
  const cookie = global.signin({ isAdmin: true });

  // Get all products
  let products = await Product.find({});

  expect(products).toHaveLength(0);

  const title = 'Title';
  const price = 20;
  const cost = 10;

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title,
      price,
      cost,
      categoryId: category.id,
    })
    .expect(201);

  products = await Product.find({});
  expect(products).toHaveLength(1);
  expect(products[0].title).toEqual(title);
  expect(products[0].price).toEqual(price);
  expect(products[0].cost).toEqual(cost);
  expect(products[0].category.toString()).toBe(category.id);
});

it('publishes an event', async () => {
  const cookie = global.signin({ isAdmin: true });

  const title = 'Title';
  const price = 20;
  const cost = 10;

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title,
      price,
      cost,
      categoryId: category.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'product:created',
    expect.any(String),
    expect.any(Function),
  );
});
