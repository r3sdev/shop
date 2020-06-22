import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Category } from '../../models/category';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/categories/${id}`)
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title: 'test',
    })
    .expect(404);
});

it('returns a 401 if the provided user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/categories/${id}`)
    .send({
      title: 'test',
    })
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
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'update',
    })
    .expect(401);

  const categoryResponse = await request(app)
    .get(`/api/categories/${response.body.id}`)
    .send();

  // Ensure the category is not updated
  expect(categoryResponse.body.title).toEqual('test');
  expect(categoryResponse.body.description).toEqual('description');
  expect(categoryResponse.body.imageUrl).toEqual('imageUrl');
});

it('returns a 400 if user does not provide a valid title', async () => {
  const cookie = global.signin({ isAdmin: true });

  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', cookie)
    .send({
      title: 'test',
    })
    .expect(201);

  await request(app)
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
    })
    .expect(400);
  await request(app)
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      description: 'test',
    })
    .expect(400);
  await request(app)
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      imageUrl: 'test',
    })
    .expect(400);
});

it('update the category provided valid input', async () => {
  // Construct a cookie
  const cookie = global.signin({ isAdmin: true });

  // Create a category
  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'description',
      imageUrl: 'imageUrl',
    })
    .expect(201);

  // Update the category
  const title = 'new test';
  const description = 'new description';
  const imageUrl = 'newImage';

  const updateResponse = await request(app)
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, description, imageUrl })
    .expect(200);

  // Update should return updated category
  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.description).toEqual(description);
  expect(updateResponse.body.imageUrl).toEqual(imageUrl);

  // Get the updated category
  const categoryResponse = await request(app)
    .get(`/api/categories/${response.body.id}`)
    .send()
    .expect(200);

  expect(categoryResponse.body.title).toEqual(title);
  expect(categoryResponse.body.description).toEqual(description);
  expect(categoryResponse.body.imageUrl).toEqual(imageUrl);
});

it('publishes an event', async () => {
  // Construct a cookie
  const cookie = global.signin({isAdmin: true});

  // Create a category
  const response = await request(app)
    .post('/api/categories')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'description',
      imageUrl: 'imageUrl'
    })
    .expect(201);

  // Update the category
  const title = 'new test';
  const description = 'new description';
  const imageUrl = 'newImage';

  await request(app)
    .put(`/api/categories/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, description, imageUrl })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'category:updated',
    expect.any(String),
    expect.any(Function),
  );
});
