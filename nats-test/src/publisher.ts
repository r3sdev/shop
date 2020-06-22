import nats from 'node-nats-streaming';
import {ProductCreatedPublisher} from './events/product-created-publisher';

console.clear();

const stan = nats.connect('shop', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new ProductCreatedPublisher(stan);

  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  })

});
