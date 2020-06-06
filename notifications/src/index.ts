import nodemailer from 'nodemailer';
import { natsWrapper } from './nats-wrapper';
import { ForgetPasswordListener } from './events/listeners/forget-password-listener';
import { UserSignedUpListener } from './events/listeners/signed-up-listener';

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

export const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const start = async () => {
  console.log('Notifications service starting ...');

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

    new ForgetPasswordListener(natsWrapper.client).listen();
    new UserSignedUpListener(natsWrapper.client).listen();

    console.log('Notifications service started');
  } catch (err) {
    console.error(err);
  }
};

start();
