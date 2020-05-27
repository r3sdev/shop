import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ramsy-it/common';

const app = express();
app.use(helmet());
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    name: 'ticketing',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app}

