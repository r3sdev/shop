import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/categories/${id}`).send().expect(404);
});

it('returns the category if the product is found', async () => {
  const title = 'Title';
  const description = 'Description';
  const imageUrl = 'http://www.url.img/image.png';

  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title,
      description,
      imageUrl
    })
    .expect(201);

  const categoryResponse = await request(app)
    .get(`/api/categories/${response.body.id}`)
    .send()
    .expect(200);

  expect(categoryResponse.body.title).toEqual(title);
  expect(categoryResponse.body.description).toEqual(description);
  expect(categoryResponse.body.imageUrl).toEqual(imageUrl);
});
