const nats = require('node-nats-streaming');

class NatsWrapper {
  private _client?: any;

  get client() {
    if (!this._client) {
      throw new Error('Cannot acces NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        console.error('Unable to connect to NATS', err.message);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
