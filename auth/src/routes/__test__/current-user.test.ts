import request from 'supertest';
import { app } from '../../app';
import { UserSignedUpPublisher } from '../../events/publisher/user-signed-up-publisher';
import NatsWrapper from '../../nats-wrapper';

jest.mock('../../events/publisher/user-signed-up-publisher', () => {})
jest.mock('../../nats-wrapper', () => {});

describe('currentUser', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (UserSignedUpPublisher as jest.Mock).mockClear();
    (NatsWrapper as jest.Mock).mockClear();

  });


  it('should response with current user when signed in', async () => {

    const cookie = await global.signin()

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()

    // expect(cookie).toEqual('test@test.com')
  });

  // it('responds with null if not authenticated', async () => {
  //   const reponse = await request(app)
  //   .get('/api/users/currentuser')
  //   .send()
  //   .expect(200);

  //   expect(reponse.body.currentUser).toEqual(null)

  // })
})

