import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Cart } from '../../models/cart';
import { natsWrapper } from '../../nats-wrapper';

describe('PUT /api/cart/:id', () => {

    const URL = '/api/cart'
    const ID = mongoose.Types.ObjectId().toHexString();

    it('should throw an error when products is not an array', async () => {

        const response = await request(app)
            .put(`${URL}/${ID}`)
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("should be array")
    })

    it('should throw an error when product[i] is invalid', async () => {
        const invalidID = await request(app)
            .put(`${URL}/${ID}`)
            .send({
                products: [
                    {
                        id: undefined,
                        title: undefined,
                        price: 0,
                        imageUrl: undefined
                    },
                    {
                        id: mongoose.Types.ObjectId().toHexString(),
                        title: 'test',
                        price: 1,
                        imageUrl: 'http://test.com'
                    }
                ]
            })
            .expect(400)

        expect(invalidID.body.errors).toHaveLength(4)
        expect(invalidID.body.errors[0].message).toEqual("product.id must be a valid id");
        expect(invalidID.body.errors[1].message).toEqual("product.title must be a string")
        expect(invalidID.body.errors[2].message).toEqual("product.price must be a float and > 0.0")
        expect(invalidID.body.errors[3].message).toEqual("product.imageUrl must be an URL")
    })

    it('should return 404 when cart is not found', async () => {
        const validId = mongoose.Types.ObjectId().toHexString();
        await request(app)
            .put(`${URL}/${validId}`)
            .send({ products: [] })
            .expect(404)
    })

    it('should return 401 when logged in and cart is not owned', async () => {
        const validId = mongoose.Types.ObjectId().toHexString();

        const cart = Cart.build({});
        cart.set({_id: validId});
        await cart.save();
        await request(app)
            .put(`${URL}/${validId}`)
            .set('Cookie', global.signin())
            .send({ products: [] })
            .expect(401)
    })

    it('should return 401 when guest and cart is not owned', async () => {
        const validId = mongoose.Types.ObjectId().toHexString();

        const cart = Cart.build({});
        cart.set({_id: validId});
        await cart.save();
        await request(app)
            .put(`${URL}/${validId}`)
            .set('Cookie', global.signinAsGuest())
            .send({ products: [] })
            .expect(401)
    })
    
    it('should update cart and emit an event when signed in', async () => {
        const _id = mongoose.Types.ObjectId().toHexString();
        const userId = mongoose.Types.ObjectId().toHexString();

        const cookie = global.signin({id: userId})

        const cart = Cart.build({});
        cart.set({_id, userId});

        await cart.save();

        await request(app)
            .put(`${URL}/${_id}`)
            .set('Cookie', cookie)
            .send({ products: [] })
            .expect(200)
        

        const data = {
            cartId: _id,
            products: []
        }
        expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
            "cart:updated",
            JSON.stringify(data),
            expect.any(Function)
        )
    })

    it('should update cart and emit an event as a guest', async () => {
        const _id = mongoose.Types.ObjectId().toHexString();

        const cookie = global.signinAsGuest()

        const cart = Cart.build({});
        cart.set({_id, guestId: "test-guestId"});

        await cart.save();

        await request(app)
            .put(`${URL}/${_id}`)
            .set('Cookie', cookie)
            .send({ products: [] })
            .expect(200)
        

        const data = {
            cartId: _id,
            products: []
        }
        expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
            "cart:updated",
            JSON.stringify(data),
            expect.any(Function)
        )
    })
})