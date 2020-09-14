import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Cart } from '../../models/cart';
import { natsWrapper } from '../../nats-wrapper';

describe('add-product', () => {
    const URL = '/api/cart';

    it('should return 400 when cartId is missing or invalid', async () => {
        const first = await request(app)
            .post(URL)
            .send()
            .expect(400);
        expect(first.body.errors[0].message).toEqual("cartId is invalid");

        const second = await request(app)
            .post(URL)
            .send({ cartId: 'invalid' })
            .expect(400);
        expect(second.body.errors[0].message).toEqual("cartId is invalid");
    });

    it('should return 400 when product is missing or invalid', async () => {
        await request(app)
            .post(URL)
            .send({ cartId: mongoose.Types.ObjectId() })
            .expect(400);

        const first = await request(app)
            .post(URL)
            .send({ cartId: mongoose.Types.ObjectId(), product: { price: 10 } })
            .expect(400);

        expect(first.body.errors[0].message).toEqual("Product ID missing");

        const second = await request(app)
            .post(URL)
            .send({ cartId: mongoose.Types.ObjectId(), product: { id: mongoose.Types.ObjectId() } })
            .expect(400);

        expect(second.body.errors[0].message).toEqual("Price needs to be > 0");
    });

    it('should return 404 when cart is missing', async () => {
        await request(app)
            .post(URL)
            .send({
                cartId: mongoose.Types.ObjectId(),
                product: { id: mongoose.Types.ObjectId(), price: 1 }
            })
            .expect(404);
    });

    it('should add product to cart and emit event', async () => {
        const userId = mongoose.Types.ObjectId().toHexString();
        const cartId = mongoose.Types.ObjectId().toHexString();
        const productId = mongoose.Types.ObjectId().toHexString();

        const cart = Cart.build({ userId });

        cart.set({ _id: cartId });

        await cart.save();

        const response = await request(app)
            .post(URL)
            .send({
                cartId,
                product: { id: productId, price: 1 }
            })
            .expect(200);

        expect(response.body).toEqual({
            existingCart: {
                id: cartId,
                products: [{ id: expect.any(String), price: 1 }],
                userId,
                version: 1
            }
        })

        expect(natsWrapper.client.publish).toHaveBeenCalledWith(
            "cart:updated",
            expect.stringContaining("products"),
            expect.any(Function)
        )
    });
})