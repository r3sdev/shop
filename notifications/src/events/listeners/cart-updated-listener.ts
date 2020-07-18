import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  CartUpdatedEvent,
} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';
import { socket, io } from '../../websocket';

export class CartUpdatedListener extends Listener<CartUpdatedEvent> {
  subject: Subjects.CartUpdated = Subjects.CartUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CartUpdatedEvent['data'], msg: Message) {
    const { cartId, products } = data;

    if (cartId) {
      console.log(`*** CART ${cartId} UPDATED ***`, products);

      io.sockets.emit(cartId, products);
    }
    msg.ack();
  }
}
