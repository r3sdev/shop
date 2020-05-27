import 'express-async-errors';
import { app } from './app';

export const COOKIE_NAME = 'ticketing';

const start = async () => {
  if (process.env.NODE_ENV !== 'test') {
      app.listen(3000, () => {
        console.log('API Service is listening on port 3000');
      });
  }
};

start();
