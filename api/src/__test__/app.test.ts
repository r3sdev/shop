import request from 'supertest';
import { app } from '../app';

it('returns a 404 on non defined URLs', async () => {
  await request(app)
    .get('/api/test')
    .send()
    .expect(404);
});
