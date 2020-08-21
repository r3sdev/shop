import {natsWrapper} from '../nats-wrapper';

describe('natsWrapper', () => {
    it('should throw an error when not connected', () => {
        expect(() => {
            natsWrapper.client
          }).toThrowError('Cannot access NATS client before connecting');
    })

    it('should connect to the backend', () => {
        // clusterId, clientId, url
        natsWrapper.connect('testCluser', 'testClient', 'testUrl')
    })
})