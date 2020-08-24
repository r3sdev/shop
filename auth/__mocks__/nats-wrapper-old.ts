class NatsWrapper {
    connect() {
        return jest.fn()
    }
}
export const natsWrapper = new NatsWrapper();