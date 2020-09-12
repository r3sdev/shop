import { generateSecret } from 'speakeasy';
import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { generateTwoFactorAuthCode, generateTwoFactorAuthSecret } from '../../services';

describe('validate-phone-number-verification', () => {

    const URL = '/api/users/phone-number/verification/validate';

    it('should return 400 when phoneNumberToken is missing', async () => {
        const response = await request(app)
            .post(URL)
            .send()
            .expect(400);

        expect(response.body.errors[0].message).toEqual("phoneNumberToken is missing")
    });

    it('should return 401 when user is not logged in', async () => {
        await request(app)
            .post(URL)
            .send({ phoneNumberToken: '123456' })
            .expect(401);
    });

    it('should return 401 when user does not exist', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({ email: "test@test.com" });

        await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({ phoneNumberToken: '123456' })
            .expect(401);
    });

    it('should return 400 when phoneNumberSecret is not set', async () => {
        const cookie = await global.signin();

        const response = await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({
                phoneNumberToken: '123456'
            })
            .expect(400);

        expect(response.body.errors[0].message).toEqual("Secret not set")
    });

    it('should return 400 when token is invalid', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        user.set({ phoneNumberSecret: 'test' });

        await user.save();

        const response = await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({ phoneNumberToken: '123456' })
            .expect(400);

        expect(response.body.errors[0].message).toEqual("Invalid token")

    });

    it('should return 400 when token is expired', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        const {base32: phoneNumberSecret} = generateTwoFactorAuthSecret();
        const invalidTime = new Date(new Date().valueOf() + 16 * 60000).getTime() / 1000;
        const phoneNumberToken = generateTwoFactorAuthCode(phoneNumberSecret, invalidTime);

        user.set({ phoneNumberSecret });

        await user.save();

        expect(user.phoneNumberVerifiedAt).toBeUndefined()

        const response = await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({ phoneNumberToken })
            .expect(400);

        expect(response.body.errors[0].message).toEqual("Invalid token")
    })

    it('should return 200 and verify phone number', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        const {base32: phoneNumberSecret} = generateTwoFactorAuthSecret()
        const validTime = new Date(new Date().valueOf() + 15 * 60000).getTime() / 1000;

        const phoneNumberToken = generateTwoFactorAuthCode(phoneNumberSecret, validTime);

        user.set({ phoneNumberSecret });

        await user.save();

        await request(app)
            .post(URL)
            .set('Cookie', cookie)
            .send({ phoneNumberToken })
            .expect(200);

        const updatedUser = await global.user();

        expect(updatedUser.phoneNumberVerifiedAt).toBeDefined()

    });
})