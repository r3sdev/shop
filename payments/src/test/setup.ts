import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
/**
 * Loads ENV variables specifically needed for testing,
 * like STRIPE_KEY
 */
require('dotenv').config();

if (!process.env.STRIPE_KEY) {
  // STRIPE_KEY needs to be set in .env
  process.exit(1)
}

declare global {
  namespace NodeJS {
    interface Global {
      signin: (userId?: string) => string[];
    }
  }
}

global.signin = (userId?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
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

  return [`shop=${base64}`];
};

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
