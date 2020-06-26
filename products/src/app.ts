import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import requestIp from 'request-ip';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
import { createProductRouter } from './routes/new';
import { showProductRouter } from './routes/show';
import { indexProductRouter } from './routes';
import { updateProductRouter } from './routes/update';
import { deleteProductRouter } from './routes/delete';

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

app.use(currentUser);

app.use(requestIp.mw());

app.use(createProductRouter);
app.use(showProductRouter);
app.use(indexProductRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
