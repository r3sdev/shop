import request from 'supertest';
import {app} from '../../app';
import { User } from '../../models/user';

describe('disable-2fa', () => {

    it('should return not authorized when not logged in', async () => {
        const response = await request(app)
        .post('/api/users/2fa/disable')
        .send()
        .expect(401)

        expect(response.body.errors[0].message).toEqual("Not authorized")
    })

    it('should return a bad request error when 2fa is already disabled', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        const response = await request(app)
        .post('/api/users/2fa/disable')
        .set('Cookie', cookie)
        .send()
        .expect(400)

        expect(response.body.errors[0].message)
        .toEqual("Two-factor authentication is not enabled")

    })

    it('should return not authorized when the user no longer exists', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({email: 'test@test.com'});

        const response = await request(app)
        .post('/api/users/2fa/disable')
        .set('Cookie', cookie)
        .send()
        .expect(401)
    })

    it('should correctly disabled two-factor authentication', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        user.set({
            twoFactorAuthEnabled: true,
            twoFactorAuthCode: 'test'
        })

        await user.save()

        const response = await request(app)
        .post('/api/users/2fa/disable')
        .set('Cookie', cookie)
        .send()
        .expect(200)

        expect(response.body.message).toEqual("Two-factor authentication disabled")
    })
})