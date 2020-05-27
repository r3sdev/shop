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

router.use('/auth/docs', swaggerUi.serve);
router.get('/auth/docs', swaggerUi.setup(auth, { ...options }));

router.use('/orders/docs', swaggerUi.serve);
router.get('/orders/docs', swaggerUi.setup(orders, { ...options }));

router.use('/payments/docs', swaggerUi.serve);
router.get('/payments/docs', swaggerUi.setup(payments, { ...options }));

router.use('/tickets/docs', swaggerUi.serve);
router.get('/tickets/docs', swaggerUi.setup(tickets, { ...options }));

export { router as swaggerRouter };
