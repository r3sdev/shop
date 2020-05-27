import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on payments', async () => {
  await request(app).get('/payments').send().expect(200);
});
