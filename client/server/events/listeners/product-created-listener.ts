import {Message} from 'node-nats-streaming';
import {Subjects, Listener, ProductCreatedEvent} from '@ramsy-dev/microservices-shop-common';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {

    console.log('*** FROM CLIENT ***', data);

    msg.ack();
  }
}