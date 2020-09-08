import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { generateTwoFactorAuthSecret, generateTwoFactorAuthCode } from '../../services';

describe('validate-2fa', () => {
    it('should throw an error when userId is missing', async () => {
        const response = await request(app)
            .post('/api/users/2fa/validate')
            .send({
                userToken: 'test'
            })
            .expect(400)

        expect(response.body.errors[0].message).toEqual("You must supply a user ID")
    })

    it('should throw an error when userToken is missing', async () => {
        const response = await request(app)
            .post('/api/users/2fa/validate')
            .send({
                userId: 'test'
            })
            .expect(400)

        expect(response.body.errors[0].message).toEqual("You must supply a user token")
    })

    it('should throw an error when userId is invalid', async () => {
        const response = await request(app)
            .post('/api/users/2fa/validate')
            .send({
                userId: 'test',
                userToken: 'test'
            })
            .expect(400)

        expect(response.body.errors[0].message).toEqual("Invalid userId")
    })

    it('should throw an error when the user no longer exists', async () => {
        const cookie = await global.signin();
        const user = await global.user();

        await User.findOneAndDelete({ email: "test@test.com" })

        await request(app)
            .post('/api/users/2fa/validate')
            .set('Cookie', cookie)
            .send({
                userId: user.id,
                userToken: 'test'
            })
            .expect(401);
    })

    it('should throw an error when the user does not have 2FA enabled', async () => {
        const cookie = await global.signin();
        const user = await global.user();

        const response = await request(app)
            .post('/api/users/2fa/validate')
            .set('Cookie', cookie)
            .send({
                userId: user.id,
                userToken: 'test'
            })
            .expect(400);

        expect(response.body.errors[0].message).toEqual("Two-factor authentication is not enabled")
    })

    it('should throw an error when an invalid token is provided', async () => {
        const cookie = await global.signin();
        const user = await global.user();

        const { base32: twoFactorAuthSecret } = generateTwoFactorAuthSecret();

        user.set({ twoFactorAuthSecret })

        await user.save()

        const response = await request(app)
            .post('/api/users/2fa/validate')
            .set('Cookie', cookie)
            .send({
                userId: user.id,
                userToken: 'test'
            })
            .expect(400);

        expect(response.body.errors[0].message).toEqual("Unable to disable two-factor authentication")
    })

    it('should disable 2FA with correct details provided', async () => {
        const cookie = await global.signin();
        const user = await global.user();

        const { base32: twoFactorAuthSecret } = generateTwoFactorAuthSecret();
        const userToken = generateTwoFactorAuthCode(twoFactorAuthSecret)
        user.set({ twoFactorAuthSecret })

        await user.save()

        const response = await request(app)
            .post('/api/users/2fa/validate')
            .set('Cookie', cookie)
            .send({
                userId: user.id,
                userToken
            })
            .expect(200);
        
        expect(response.header['set-cookie'][0].startsWith("shop=")).toBeTruthy()
        expect(response.body).toEqual({"twoFactorAuthEnabled": false})
    })


})