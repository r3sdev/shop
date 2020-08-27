import { UserVerifyPhoneNumberPublisher } from '../user-verify-phone-number-publisher';

it('should publish an event', () => {

    const client: any = {
        publish: jest.fn()
    }

    const data = {
        to: "+31612345678",
        body: "Test body"
    }

    const event = new UserVerifyPhoneNumberPublisher(client).publish(data)

    expect(client.publish)
        .toHaveBeenCalledWith(
            "user:verify-phone-number",
            JSON.stringify(data),
            expect.any(Function)
        )
})