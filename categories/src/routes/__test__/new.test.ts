import request from 'supertest';
import { app } from '../../app';
import { Category } from '../../models/category';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/categories for post requests', async () => {
  const response = await request(app).post('/api/categories').send({});

  expect(response.status).not.toBe(404);
});

it('can only be accessed if the user is logged in as an admin', async () => {
  await request(app)
    .post('/api/categories')
    .send({ title: 'test' })
    .expect(401);
  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: false }))
    .send({ title: 'test' })
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({});

  expect(response.status).not.toBe(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title: '',
    })
    .expect(400);

  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      description: 'test',
    })
    .expect(400);
});

it('should throw an error when duplicate', async () => {
  const title = 'Title';
  const description = 'Description';
  const imageUrl = 'http://www.url.img/image.png';

  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title,
      description,
      imageUrl,
    })
    .expect(201);

  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title,
      description,
      imageUrl,
    })
    .expect(400);

  expect(response.body.errors[0].message).toEqual("Category with same title already exists")
})

it('creates a category with valid inputs', async () => {
  // Get all products
  let categories = await Category.find({});

  expect(categories).toHaveLength(0);

  const title = 'Title';
  const description = 'Description';
  const imageUrl = 'http://www.url.img/image.png';

  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title,
      description,
      imageUrl,
    })
    .expect(201);

  categories = await Category.find({});
  expect(categories).toHaveLength(1);
  expect(categories[0].title).toEqual(title);
  expect(categories[0].description).toEqual(description);
  expect(categories[0].imageUrl).toEqual(imageUrl);
});

it('publishes an event', async () => {
  const title = 'Title';
  const description = 'Description';
  const imageUrl = 'http://www.url.img/image.png';

  await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title,
      description,
      imageUrl
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'category:created',
    expect.any(String),
    expect.any(Function),
  );
});
