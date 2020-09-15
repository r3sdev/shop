import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Cart } from '../../models/cart';
import { natsWrapper } from '../../nats-wrapper';

describe('POST /api/cart/:id', () => {
    const URL = '/api/cart';

    it('should throw an error when :id is invalid', async () => {
        const response = await request(app)
            .post(`${URL}/id`)
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("/api/cart/:id is invalid")
    })

    it('should return 404 when cart is not found', async () => {
        const id = mongoose.Types.ObjectId().toHexString()
        await request(app)
            .post(`${URL}/${id}`)
            .send()
            .expect(404)
    })

    it('should remove all products from cart and emits an event', async () => {
        const id = mongoose.Types.ObjectId().toHexString()

        const cart = Cart.build({
            products: [
                { id, price: 1, title: "test", imageUrl: "none" }
            ]
        })

        cart.set({ _id: id })

        await cart.save();

        expect(cart.id).toEqual(id);
        expect(cart.products).toHaveLength(1)

        const response = await request(app)
            .post(`${URL}/${id}`)
            .send()
            .expect(200)
        
        // Cart is updated
        expect(response.body.version).toEqual(1);
        // Cart is empty
        expect(response.body.products).toEqual([])
        // Event is emitted
        expect(natsWrapper.client.publish).toHaveBeenCalledWith(
            "cart:updated",
            expect.stringMatching(/{\"cartId\":\"\w{24}\",\"products\":\[\]}/),
            expect.any(Function)
        )
    })


})