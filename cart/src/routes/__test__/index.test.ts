import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Cart } from '../../models/cart';

describe('GET /api/cart', () => {

  const URL = '/api/cart';

  describe('as a logged in user', () => {

    let cookie: string[];
    let userId: string;
    let cart;

    async function setupCart() {
      userId = mongoose.Types.ObjectId().toHexString();
      cookie = global.signin({ id: userId });

      cart = Cart.build({ userId });
      await cart.save();
    }

    it('should return an existing cart when found', async () => {
      await setupCart()
      const response = await request(app)
        .get(URL)
        .set('Cookie', cookie)
        .send()
      expect(response.body.userId).toEqual(userId)
    });

    it('should return a new cart when no cart exists', async () => {
      userId = mongoose.Types.ObjectId().toHexString();
      cookie = global.signin({ id: userId });

      const response = await request(app)
        .get(URL)
        .set('Cookie', cookie)
        .send()
      expect(response.body.userId).toEqual(userId)
    });
  })

  describe('as a guest user', () => {
    it('should return an existing cart when found', async () => {
      const cookie = global.signinAsGuest();

      const cart = Cart.build({ guestId: 'test-guestId' });

      await cart.save();

      const response = await request(app)
        .get(URL)
        .set('Cookie', cookie)
        .send()

      expect(response.body.guestId).toEqual("test-guestId");
    });

    it('should return a new cart when no cart exists', async () => {

      const response = await request(app)
        .get(URL)
        .send()

      expect(response.body.guestId).toEqual(expect.any(String));
    });
  })
})