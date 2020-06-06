import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ramsy-it/common';
import cors from 'cors';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { generate2FARouter } from './routes/generate-2fa';
import { enable2FARouter } from './routes/enable-2fa';
import { disable2FARouter } from './routes/disable-2fa';
import { validate2FARouter } from './routes/validate-2fa';
import { forgotPasswordRouter } from './routes/forgot-password';
import { resetPasswordRouter } from './routes/reset-password';
import { verifyEmailRouter } from './routes/verify-email';

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

app.use(cors());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(generate2FARouter);
app.use(enable2FARouter);
app.use(disable2FARouter);
app.use(validate2FARouter);
app.use(forgotPasswordRouter);
app.use(resetPasswordRouter);
app.use(verifyEmailRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
