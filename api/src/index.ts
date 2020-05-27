import 'express-async-errors';
import { app } from './app';

const COOKIE_NAME = 'ticketing';

const server = app.listen(3000, () => {
  console.log('API service is listening on port 3000');
});

export { COOKIE_NAME, server };
