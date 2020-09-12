import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';

describe('verify-phone-number', () => {

    const URL = '/api/users/phone-number/verification/request'

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should throw an error when phone number is missing', async () => {
        const response = await request(app)
            .post(URL)
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("You must supply a valid phone number")
    })

    it('should throw 401 when not logged in', async () => {
        await request(app)
            .post(URL)
            .send({
                phoneNumber: "0612345678"
            })
            .expect(401)
    })

    it('should throw 401 when user is removed', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({ email: "test@test.com" })

        await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                phoneNumber: "0612345678"
            })
            .expect(401)
    })

    it('should throw an error when phone number is non-Dutch', async () => {
        await request(app)
            .post(URL)
            .send({
                phoneNumber: "0712345678"
            })
            .expect(400)
    });

    it('should throw an error when phone number is invalid', async () => {
        await request(app)
            .post(URL)
            .send({
                phoneNumber: "001"
            })
            .expect(400)
    });

    it('should set valid phone number and token', async () => {
        const cookie = await global.signin();

        await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                phoneNumber: "0612345678"
            })
            .expect(200)
    });

    it('should emit an event and return 200', async () => {
        const cookie = await global.signin();

        await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                phoneNumber: "0612345678"
            })
            .expect(200)

        const regExp = /{\"to\":\"[\d]{10}\",\"body\":\"\\n[\d]{6} is your Shop verification code.\\nThis will expire in [\d]{2} minutes.\\n\"}/

        expect(natsWrapper.client.publish)
            .toHaveBeenCalledWith(
                "user:verify-phone-number",
                expect.stringMatching(regExp),
                expect.any(Function)
            )
    });

})