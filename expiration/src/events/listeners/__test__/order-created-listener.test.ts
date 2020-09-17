import { OrderCreatedEvent, OrderStatus } from '@ramsy-dev/microservices-shop-common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { expirationQueue } from '../../../queues/expiration-queue';


const setup = async () => {

    const DATE_TO_USE = new Date('2016');
    const _Date = Date;
    // @ts-ignore
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;

    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: "test-orderId",
        version: 1,
        status: OrderStatus.Created,
        expiresAt: new Date(1).toString(),
        product: {
            id: "test-productId",
            price: 1
        },
        userId: "test-userId"
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};


it('updates the status of the order', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(expirationQueue.add).toHaveBeenLastCalledWith({orderId: "test-orderId"}, {delay: 0})
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
