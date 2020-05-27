import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on orders', async () => {
  await request(app).get('/orders').send().expect(200);
});
