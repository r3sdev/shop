import { UserSignedUpPublisher } from '../user-signed-up-publisher';

it('should publish an event', () => {

    const client: any = {
        publish: jest.fn()
    }

    const data = {
        email: "test@test.com",
        link: "http://www.test.com"
    }

    const event = new UserSignedUpPublisher(client).publish(data)

    expect(client.publish)
        .toHaveBeenCalledWith(
            "user:signed-up",
            JSON.stringify(data),
            expect.any(Function)
        )
})