import { CartUpdatedPublisher,  } from '../cart-updated-publisher';
import { CartUpdatedEvent } from '@ramsy-dev/microservices-shop-common';


describe("CartUpdatedPublisher", () => {
    it('should publish an event', () => {

        const client: any = {
            publish: jest.fn()
        }
    
        const data: CartUpdatedEvent['data'] = {
            cartId: "test",
            products: []
        }
    
        new CartUpdatedPublisher(client).publish(data)
    
        expect(client.publish)
            .toHaveBeenCalledWith(
                "cart:updated",
                JSON.stringify(data),
                expect.any(Function)
            )
    })
})

