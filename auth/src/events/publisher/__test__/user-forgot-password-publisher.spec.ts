import { UserLostPasswordPublisher } from '../user-forgot-password-publisher';

it('should publish an event', () => {

    const client: any = {
        publish: jest.fn()
    }

    const data = {
        email: "test@test.com",
        link: "http://www.test.com"
    }

    const event = new UserLostPasswordPublisher(client).publish(data)

    expect(client.publish)
        .toHaveBeenCalledWith(
            "user:forgot-password",
            JSON.stringify(data),
            expect.any(Function)
        )
})