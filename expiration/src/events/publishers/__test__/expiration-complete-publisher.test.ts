import { ExpirationCompletePublisher } from '../expiration-complete-publisher';

it('should publish an event', () => {

    const client: any = {
        publish: jest.fn()
    }

    const data = {
        orderId: "test",
    }

    new ExpirationCompletePublisher(client).publish(data)

    expect(client.publish)
        .toHaveBeenCalledWith(
            "expiration:complete",
            JSON.stringify(data),
            expect.any(Function)
        )
})