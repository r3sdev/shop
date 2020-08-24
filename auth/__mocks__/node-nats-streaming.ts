const client = {
    on: (event: string, callback: Function) => {
        return jest.fn()
    },
    publish: (subject: string, data: any, callback: Function) => {
        console.debug('Publishing event', subject, data, callback)
        
        return jest.fn()
    }
}


const nats = {
    connect: (clusterId: string, clientId: string, { url }: {url: string}) => {

        return client
    }
}

export default nats;