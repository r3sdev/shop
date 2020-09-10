import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

describe('remove-phone-number', () => {
    const url = "/api/users/phone-number/remove"

    it('should throw an error when user is not logged in', async () => {
        const response = await request(app)
            .post(url)
            .send()
            .expect(401)
    });

    it('should throw an error when the user invalid', async () => {
        const cookie = await global.signin();

        await User.findOneAndDelete({ email: "test@test.com" });

        const response = await request(app)
            .post(url)
            .set('Cookie', cookie)
            .send()
            .expect(401)
    })

    it('should throw an error when phone number is not set', async () => {
        const cookie = await global.signin();

        const response = await request(app)
            .post(url)
            .set('Cookie', cookie)
            .send()
            .expect(400)

        expect(response.body.errors[0].message).toEqual("Phone number has not been set")
    })
    it('should return 200 when phone number is removed', async () => {
        const cookie = await global.signin();

        const user = await global.user();

        user.set({
            phoneNumber: "+316123456789", 
            phoneNumberToken: "test",
            phoneNumberVerifiedAt: new Date()
        })

        await user.save()

        await request(app)
            .post(url)
            .set('Cookie', cookie)
            .send()
            .expect(200)

        const updatedUser = await User.findOne({email: "test@test.com"});

        expect(updatedUser!.phoneNumber).toBeUndefined();
        expect(updatedUser!.phoneNumberToken).toBeUndefined();
        expect(updatedUser!.phoneNumberVerifiedAt).toBeUndefined();

    })
})