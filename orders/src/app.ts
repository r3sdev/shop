import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@ramsy-it/common';
import {patchOrderRouter} from './routes/patch';
import {indexOrderRouter} from './routes/index';
import {newOrderRouter} from './routes/new';
import {showOrderRouter} from './routes/show'

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

app.use(patchOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
