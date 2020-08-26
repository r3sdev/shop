import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

describe('Email verficiation', () => {
    it('should redirect when the verification token is missing', async () => {

        const cookie = await global.signin()

        const response = await request(app)
            .get('/api/users/verify-email/:token')
            .set('Cookie', cookie)
            .send()
            .expect(302)

        expect(response.header.location).toEqual("/auth/email/verification/error")

    });

    it('should locate the user with a correct token, verify and set a cookie', async () => {
        const cookie = await global.signin()

        const user = await User.findOne({ email: 'test@test.com' });

        expect(user).toBeDefined();
        expect(user!.emailToken).toBeDefined();
        expect(user!.emailVerifiedAt).toBeUndefined()


        const response = await request(app)
            .get(`/api/users/verify-email/${user!.emailToken}`)
            .set('Cookie', cookie)
            .send()
            .expect(302)

        expect(response.header.location).toEqual("/auth/email/verification/success")

        const verifiedUser = await User.findOne({ email: 'test@test.com' });
        expect(verifiedUser!.emailToken).toBeUndefined();
        expect(verifiedUser!.emailVerifiedAt).toBeDefined();

        expect(response.get('Set-Cookie')).toBeDefined();
    })
})