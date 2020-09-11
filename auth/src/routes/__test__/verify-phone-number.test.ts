import request from 'supertest';
import {app} from '../../app';

describe('verify-phone-number', () => {
    const url = '/api/users/phone-number/verification/request'

    it('should throw an error when phone number is missing', async () => {
        const response = await request(app)
        .post(url)
        .send()
        .expect(400)

        expect(response.body.errors[0].message).toEqual("You must supply a phone number")
    })

    it('should throw an error when phone number is non-Dutch', async () => {

    });

    it.todo('should throw an error when phone number is invalid');
    it.todo('should throw a 401 when user is not logged in');
    it.todo('should set the phone number and token for now');
    it.todo('should emit an event and return 200');
    
})