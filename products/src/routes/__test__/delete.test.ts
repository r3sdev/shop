import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Category } from '../../models/category';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/products/${id}`)
    .set('Cookie', global.signin({ isAdmin: true }))
    .send()
    .expect(404);
});

it('returns a 401 if the provided user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).delete(`/api/products/${id}`).send().expect(401);
});

it('deletes the product', async () => {
  // Construct a cookie
  const cookie = global.signin({
    isAdmin: true,
  });

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
    version: 1
  });

  await category.save();

  // Create a product
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 5,
      categoryId: category.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
});
