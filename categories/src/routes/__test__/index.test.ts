import request from 'supertest';
import { app } from '../../app';

const createCategory = () => {
  return request(app).post('/api/categories').set('Cookie', global.signin({isAdmin: true})).send({
    title: new Date().getTime().toString(),
  });
};

it('can fetch a list of categories', async () => {
  await createCategory();
  await createCategory();
  await createCategory();

  const response = await request(app)
  .get('/api/categories')
  .send()
  .expect(200)

  expect(response.body).toHaveLength(3)
});
