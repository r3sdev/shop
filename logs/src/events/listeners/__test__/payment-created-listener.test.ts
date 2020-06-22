import mongoose from 'mongoose';
import { PaymentCreatedEvent } from '@ramsy-dev/microservices-shop-common';
import { Message } from 'node-nats-streaming';
import { PaymentCreatedListener } from '../payment-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Event } from '../../../../models/event';

const setup = async () => {
  // Create a listener instance
  const listener = new PaymentCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: PaymentCreatedEvent['data'] = {
    orderId: mongoose.Types.ObjectId().toHexString(),
    id: mongoose.Types.ObjectId().toHexString(),
    stripeId: 'testStripeId'
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('saves the event', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert a event was created
  const events = await Event.find({});

  expect(events).toHaveLength(1);
  expect(events[0].event).toEqual('PaymentCreated');
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
