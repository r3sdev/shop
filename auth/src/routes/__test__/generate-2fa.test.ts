import request from 'supertest';
import {app} from '../../app';
import { User } from '../../models/user';

describe('generate-2fa', () => {
    it('should return an error when not signed in', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({email: "test@test.com"})

        const response = await request(app)
        .post('/api/users/2fa/generate')
        .set('Cookie', cookie)
        .send()
        .expect(401)

        expect(response.body.errors[0].message).toEqual("Not authorized")
    })

    it('should set twoFactorAuthSecret for user', async () => {
        const cookie = await global.signin();

        const response = await request(app)
        .post('/api/users/2fa/generate')
        .set('Cookie', cookie)
        .send()
        .expect(200)

        const user = await User.findOne({email: "test@test.com"})
        expect(user!.twoFactorAuthSecret).toBeDefined();
    })

    it('should return a QR code', async () => {
        const cookie = await global.signin();

        const response = await request(app)
        .post('/api/users/2fa/generate')
        .set('Cookie', cookie)
        .send()
        .expect(200)

        expect(response.body.otpauthUrl.startsWith("otpauth://totp/2FA?secret=")).toBeTruthy();
    })
})