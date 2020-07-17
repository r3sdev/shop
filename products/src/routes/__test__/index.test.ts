import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Category } from '../../models/category';

const createProduct = async () => {
  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
    version: 1
  });

  await category.save();
  return request(app)
    .post('/api/products')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title: new Date().getTime().toString(),
      price: 20,
      cost: 10,
      categoryId: category.id,
    });
};

it('can fetch a list of products', async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get('/api/products').send().expect(200);

  expect(response.body).toHaveLength(3);
});
