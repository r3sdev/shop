import 'express-async-errors';
import {app} from './app'

const start = async () => {
  app.listen(3000, () => {
    console.log('API service is listening on port 3000');
  });
};

start();
