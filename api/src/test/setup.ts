import jwt from 'jsonwebtoken';
import { COOKIE_NAME, server } from '..';

declare global {
  namespace NodeJS {
    interface Global {
      signin: () => string[];
    }
  }
}

global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: '5d273f9ed58f5e7093b549b0',
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: jwt_data }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessonJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessonJSON).toString('base64');

  // return a string thats the cookie with the encode data

  return [`${COOKIE_NAME}=${base64}`];
};

beforeAll(async () => {
  // Setup ENV variables
  process.env.JWT_KEY = 'test';
});

beforeEach(async () => {
  jest.clearAllMocks();


});

afterAll(async () => {
  console.log('Stopping Express server ...')
  server.close();
});
