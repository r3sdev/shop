
class Nats {
    connect() {
        return {
            on(method: string, callback: Function) {
                return jest.fn()
            }
        }
    }
}

export default new Nats();