import mongoose from 'mongoose';
import {OrderStatus} from '@ramsy-dev/microservices-shop-common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

/* This is already mocked */
import { natsWrapper } from '../../nats-wrapper';

it.todo('should check if user is authenticated');

it.todo('should have a valid ticket id');

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test ticket',
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'testUderId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // Check there are no orders in the database
  expect(await Order.find({})).toHaveLength(0);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test ticket',
  });

  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  // Check if the order is returned
  expect(response.body.status).toEqual('created');

  // Check an order is created in the database
  const orders = await Order.find({});
  expect(orders).toHaveLength(1);
  expect(orders[0].status).toEqual('created');

  // Check if the tickets match
  expect(orders[0].ticket.id.toString('hex')).toEqual(ticket.id);
});

it('emit an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'Test ticket',
  });

  await ticket.save();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'order:created',
    expect.stringContaining(order.id),
    expect.any(Function),
  );
});
