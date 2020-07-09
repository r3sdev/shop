import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Cart } from '../../models/cart';

const createCart = async () => {
  const cart = Cart.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await cart.save();
  return request(app)
    .post('/api/cart')
    .set('Cookie', global.signin({ isAdmin: true }))
    .send({
      title: new Date().getTime().toString(),
      price: 20,
      cost: 10,
      categoryId: cart.id,
    });
};

it('can fetch a list of carts', async () => {


  const response = await request(app).get('/api/cart').send().expect(200);

});
