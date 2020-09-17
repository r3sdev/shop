
jest.mock('../nats-wrapper');
jest.mock('../queues/expiration-queue')

beforeAll(async () => {
  // 
});

beforeEach(async () => {
  // 
  jest.clearAllMocks();

  var redis = require("redis-mock"),
    client = redis.createClient();
});

afterAll(async () => {
  //
});
