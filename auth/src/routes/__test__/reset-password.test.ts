import request from 'supertest';
import { app } from '../../app';

describe('GET /api/users/reset-password/:token', () => {
    const url = '/api/users/reset-password/'

    it('should throw an error when the token is invalid', async () => {
        await request(app)
            .get(url + 'invalid-token')
            .send()
            .expect(404)
    });

    it('should throw an error when the token is valid, but expired', async () => {
        await global.signin();

        const user = await global.user();

        user.set({
            resetPasswordToken: 'test-token',
            resetPasswordTokenExpires: new Date("01-01-1970")
        })

        await user.save();

        const response = await request(app)
            .get(url + 'test-token')
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("Token is expired")
    });

    it('should return 200 when the token is valid and actual', async () => {
        await global.signin();

        const user = await global.user();

        user.set({
            resetPasswordToken: 'test-token',
            resetPasswordTokenExpires: new Date(new Date().valueOf() + 60000)
        })

        await user.save();

        const response = await request(app)
            .get(url + 'test-token')
            .send()
            .expect(200)
    })

})

describe('POST /api/users/reset-password', () => {
    const url = '/api/users/reset-password'

    it('should throw an error when resetPasswordToken is missing', async () => {
        const response = await request(app)
            .post(url)
            .send({
                password: 'password'
            })
            .expect(400)

        expect(response.body.errors[0].message)
            .toEqual("resetPasswordToken is missing")
    });

    it('should throw an error when password is missing', async () => {
        const response = await request(app)
            .post(url)
            .send({
                resetPasswordToken: 'passwordToken'
            })
            .expect(400)

        expect(response.body.errors[0].message)
            .toEqual("password is missing")
    });

    it('should throw an error when token is invalid', async () => {
        const response = await request(app)
            .post(url)
            .send({
                resetPasswordToken: 'passwordToken',
                password: 'password'
            })
            .expect(404)
    });

    it('should set password, cookie and unset token and expiration', async () => {
        await global.signin();

        const user = await global.user();

        user.set({
            resetPasswordToken: 'test-token',
            resetPasswordTokenExpires: new Date(new Date().valueOf() + 60000)
        })

        await user.save();

        const response = await request(app)
        .post(url)
        .send({
            resetPasswordToken: 'test-token',
            password: 'password'
        })
        .expect(200)

        expect(response.header['set-cookie'][0].startsWith("shop=")).toBeTruthy()
    });
})