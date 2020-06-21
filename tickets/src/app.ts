import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import requestIp from 'request-ip';
import { errorHandler, NotFoundError, currentUser } from '@ramsy-dev/microservices-shop-common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import {updateTicketRouter} from './routes/update';

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
