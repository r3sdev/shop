import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Category } from '../../models/category';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/categories/${id}`)
    .set('Cookie', global.signin({ isAdmin: true }))
    .send()
    .expect(404);
});

it('returns a 401 if the provided user is not authenticated', async () => {
  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title: 'test',
      description: 'description',
      imageUrl: 'imageUrl',
    })
    .expect(201);

    await request(app)
    .delete(`/api/categories/${response.body.id}`)
    .send()
    .expect(401);
});

it('returns a 401 of the user is not an admin', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', global.signin({ isAdmin: true }))
      .send({
        title: 'test',
        description: 'description',
        imageUrl: 'imageUrl',
      })
      .expect(201);

  await request(app)
    .delete(`/api/categories/${response.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);

  const categoryResponse = await request(app)
    .get(`/api/categories/${response.body.id}`)
    .send();

  // Ensure the category is not updated
  expect(categoryResponse.body.title).toEqual('test');
  expect(categoryResponse.body.description).toEqual('description');
  expect(categoryResponse.body.imageUrl).toEqual('imageUrl');
});

it('deletes the category provided valid input', async () => {
  // Construct a cookie
  const cookie = global.signin({ isAdmin: true });

  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'description',
      imageUrl: 'imageUrl',
    })
    .expect(201);

  // Delete the category
  await request(app)
    .delete(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
});

it.only('publishes an event', async () => {
  // Construct a cookie
  const cookie = global.signin({
    isAdmin: true,
  });

  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'description',
      imageUrl: 'imageUrl',
    })
    .expect(201);

  // Delete the category
  await request(app)
    .delete(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'category:deleted',
    expect.any(String),
    expect.any(Function),
  );
});
