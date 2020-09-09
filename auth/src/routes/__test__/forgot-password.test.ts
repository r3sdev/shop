import request from 'supertest';
import { app } from '../../app';

import { natsWrapper } from '../../nats-wrapper';
import { User } from '../../models/user';


describe('forgot-password', () => {
    const url = '/api/users/forgot-password';

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should throw an error when email is missing in post body', async () => {
        const response = await request(app)
            .post(url)
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("You must supply an email address")
    })

    it('should throw an error when email is invalid', async () => {
        await request(app)
            .post(url)
            .send({ email: "test" })
            .expect(204)
    })

    it('should respond with 204 when user is not found', async () => {
        await request(app)
            .post(url)
            .send({ email: "test@test.com" })
            .expect(204)
    })

    it('should set a reset token and expiry', async () => {
        await global.signin();

        await request(app)
            .post(url)
            .send({ email: "test@test.com" })

        const user = await global.user();

        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordTokenExpires).toBeDefined()
    })

    it('should publish an event', async () => {
        process.env.BASE_URL = "https://www.test-base.url";

        await global.signin();

        await request(app)
            .post(url)
            .send({ email: "test@test.com" })

        const regExp = /{\"email\":\"test@test.com\",\"link\":\"https:\/\/www.test-base.url\/auth\/reset-password\/[\S]{32}\"}/

        expect(natsWrapper.client.publish)
            .toHaveBeenCalledWith(
                "user:forgot-password",
                expect.stringMatching(regExp),
                expect.any(Function)
            )
    })

    it('should respond with 204 when user is found', async () => {
        await global.signin();

        await request(app)
            .post(url)
            .send({ email: "test@test.com" })
            .expect(204)
    })
})