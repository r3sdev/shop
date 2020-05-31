import mongoose from 'mongoose';
import { ExpirationCompleteEvent } from '@ramsy-it/common';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Event } from '../../../../models/event';

const setup = async () => {
  // Create a listener instance
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: new mongoose.Types.ObjectId().toHexString(),
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

  // Assert a ticket was created
  const tickets = await Event.find({});

  expect(tickets).toHaveLength(1);
  expect(tickets[0].event).toEqual('ExpirationComplete');
});

it('acks the message', async () => {
  // Setup
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Assert ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
