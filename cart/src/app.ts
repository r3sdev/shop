import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
const { healthz } = require('express-healthz');

import { indexCartRouter } from './routes';
import { addProductCartRouter } from './routes/add-product';
import { emptyCartRouter } from './routes/empty-cart';
import { updateCartRouter } from './routes/update';

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    name: 'shop',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(healthz);

app.use(currentUser);

app.use(indexCartRouter);
app.use(updateCartRouter);
app.use(addProductCartRouter);
app.use(emptyCartRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
