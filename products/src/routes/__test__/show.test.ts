import request from 'supertest';
import mongoose from 'mongoose';
import { Category } from '../../models/category';
import { app } from '../../app';

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it('returns the product if the product is found', async () => {
  const cookie = global.signin({ isAdmin: true });

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
    version: 1
  });

  await category.save();

  const title = 'concert';
  const price = 20;
  const cost = 10;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title,
      price,
      cost,
      categoryId: category.id,
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
});
