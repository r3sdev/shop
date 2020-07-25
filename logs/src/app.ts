import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import {
  errorHandler,
  NotFoundError,
} from '@ramsy-dev/microservices-shop-common';
import { createLogRouter } from './routes/new';

const { healthz } = require('express-healthz');

const app = express();
app.use(helmet());
app.set('trust proxy', true);

app.use(json());

app.use(healthz);

app.use(createLogRouter);

// Catch all non defined urls
app.all('*', (req) => {
  console.log(req.url);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
