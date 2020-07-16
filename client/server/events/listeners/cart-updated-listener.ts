import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  CartUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';

export class CartUpdatedListener extends Listener<CartUpdatedEvent> {
  subject: Subjects.CartUpdated = Subjects.CartUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CartUpdatedEvent['data'], msg: Message) {
    console.log('*** CART UPDATED ***', data);

    msg.ack();
  }
}
