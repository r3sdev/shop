import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await global.signin();

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

    expect(response.get('Set-Cookie')[0]).toBe(
      'shop=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    );
});
