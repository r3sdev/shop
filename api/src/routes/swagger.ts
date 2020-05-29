import express, { Response, Request } from 'express';
import swaggerUi from 'swagger-ui-express';
const auth = require('../swagger/auth.json');
const orders = require('../swagger/orders.json');
const payments = require('../swagger/payments.json');
const tickets = require('../swagger/tickets.json');

const router = express.Router();

var options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

router.use('/docs/auth', swaggerUi.serve);
router.get('/docs/auth', swaggerUi.setup(auth, { ...options }));

router.use('/docs/orders', swaggerUi.serve);
router.get('/docs/orders', swaggerUi.setup(orders, { ...options }));

router.use('/docs/payments', swaggerUi.serve);
router.get('/docs/payments', swaggerUi.setup(payments, { ...options }));

router.use('/docs/tickets', swaggerUi.serve);
router.get('/docs/tickets', swaggerUi.setup(tickets, { ...options }));

export { router as swaggerRouter };
