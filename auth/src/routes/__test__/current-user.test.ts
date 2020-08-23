import request from 'supertest';
import { app } from '../../app';

describe('currentUser', () => {

  it('should response with current user when signed in', async () => {

    const cookie = await global.signin()

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()

      expect(response.body.currentUser.email).toEqual("test@test.com")

  });

  // it('responds with null if not authenticated', async () => {
  //   const reponse = await request(app)
  //   .get('/api/users/currentuser')
  //   .send()
  //   .expect(200);

  //   expect(reponse.body.currentUser).toEqual(null)

  // })
})

