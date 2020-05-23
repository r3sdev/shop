import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import {Ticket} from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 10,
    })
    .expect(404);
});

it('returns a 401 if the provided user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(401);
});

it('returns a 401 of the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'update',
      price: 10,
    })
    .expect(401);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  // Ensure the ticket is not updated
  expect(ticketResponse.body.title).toEqual('test');
  expect(ticketResponse.body.price).toEqual(20);
});

it('returns a 400 if user does not provide a valid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);
});

it('update the ticket provided valid input', async () => {
  // Construct a cookie
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  // Update the ticket
  const title = 'new test';
  const price = 100;

  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  // Update should return updated ticket
  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.price).toEqual(price);

  // Get the updated ticket
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('publishes an event', async () => {
  // Construct a cookie
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  // Update the ticket
  const title = 'new test';
  const price = 100;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'ticket:updated',
    expect.any(String),
    expect.any(Function),
  );
});

it('rejects updates if the ticket is reserved', async () => {
  // Construct a cookie
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({orderId: mongoose.Types.ObjectId().toHexString()})

  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new',
      price: 10,
    })
    .expect(400);
});
