import request from 'supertest';
import { app } from '../../app'
import { enable2FARouter } from '../enable-2fa';
import { User } from '../../models/user';
import { generateTwoFactorAuthSecret, generateTwoFactorAuthCode } from '../../services';

describe('enable2FARouter', () => {
    it('should return an error when userToken is missing', async () => {
        const response = await request(app)
            .post('/api/users/2fa/enable')
            .send()
            .expect(400)

        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].field).toEqual("userToken")
        expect(response.body.errors[0].message).toBeDefined()
    })

    it('should return an error when the current user cannot be found', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({email: "test@test.com"})

        const response = await request(app)
        .post('/api/users/2fa/enable')
        .set('Cookie', cookie)
        .send({
            userToken: "testToken"
        })
        .expect(401)

        expect(response.body.errors[0].message).toEqual("Not authorized")
    })

    it('should return an error when the token is invalid', async () => {
        const cookie = await global.signin();

        const response = await request(app)
        .post('/api/users/2fa/enable')
        .set('Cookie', cookie)
        .send({
            userToken: "testToken"
        })
        .expect(400)

        expect(response.body.errors[0].message).toEqual("Invalid token")
    })

    it('should enable two-factor authentication with a valid token', async () => {
        const cookie = await global.signin();

        // Generate a secret
        const {base32: twoFactorAuthSecret} = generateTwoFactorAuthSecret()
        const code = generateTwoFactorAuthCode(twoFactorAuthSecret)

        const user = await User.findOne({email: "test@test.com"});

        user!.set({twoFactorAuthSecret})

        await user!.save();

        const response = await request(app)
        .post('/api/users/2fa/enable')
        .set('Cookie', cookie)
        .send({
            userToken: code
        })

        const updatedUser = await User.findOne({email: 'test@test.com'});

        expect(updatedUser!.twoFactorAuthEnabled).toBeTruthy();
        expect(response.body.message).toEqual("Two-factor Authentication enabled")
    })
})