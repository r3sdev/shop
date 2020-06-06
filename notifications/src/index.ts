import { natsWrapper } from './nats-wrapper';
import { ForgetPasswordListener } from './events/listeners/forget-password-listener';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST must be defined');
  }
  if (!process.env.SMTP_PORT) {
    throw new Error('SMTP_PORT must be defined');
  }
  if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER must be defined');
  }
  if (!process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_PASSWORD must be defined');
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

    new ForgetPasswordListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
