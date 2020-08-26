///<reference path="app.d.ts" />

import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
} from '@ramsy-dev/microservices-shop-common';
import cors from 'cors';
import * as routes from './routes';
import { healthz } from 'express-healthz';

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

app.use(cors());

app.use(healthz);

app.use(routes.currentUserRouter);
app.use(routes.signinRouter);
app.use(routes.signoutRouter);
app.use(routes.signupRouter);
app.use(routes.generate2FARouter);
app.use(routes.enable2FARouter);
app.use(routes.disable2FARouter);
app.use(routes.validate2FARouter);
app.use(routes.forgotPasswordRouter);
app.use(routes.resetPasswordRouter);
app.use(routes.verifyEmailRouter);
app.use(routes.verifyPhoneNumberRouter);
app.use(routes.validatePhoneNumberVerificationRouter);
app.use(routes.removePhoneNumberRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
