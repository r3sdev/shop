import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
// import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
import upload from 'express-fileupload';

import { uploadRouter } from './routes/upload';

const app = express();

app.use(helmet());
app.set('trust proxy', true);
// app.use(json());
app.use(
  cookieSession({
    name: 'shop',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(upload);

app.use(currentUser);


app.use(uploadRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
