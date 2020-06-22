import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on auth', async () => {
  await request(app).get('/auth').send().expect(200);
});
