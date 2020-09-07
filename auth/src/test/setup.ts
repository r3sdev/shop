import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { UserDoc, User } from '../models/user';

declare global {
  namespace NodeJS {
    interface Global {
      signin: () => Promise<string[]>
      user: () => Promise<UserDoc>
    }
  }
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'Password12341!';
  const fullName = 'Jest Test'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password, passwordConfirmation: password, fullName })
    .expect(200)

  const cookie = response.get('Set-Cookie');

  return cookie;
};

global.user = async () => {
  const user = User.findOne({email: 'test@test.com'})

  return user as unknown as Promise<UserDoc>
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // Setup ENV variables
  process.env.JWT_KEY = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
