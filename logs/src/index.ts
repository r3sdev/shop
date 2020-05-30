import { natsWrapper } from './nats-wrapper';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const start = async () => {
  console.log('Logs service started ...');

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ExpirationCompleteListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    console.log('Logs service started!');
  } catch (err) {
    console.error(err);
  }
};

start();
