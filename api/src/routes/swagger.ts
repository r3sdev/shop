import express, { Response, Request } from 'express';
import swaggerUi from 'swagger-ui-express';
const auth = require('../swagger/auth.json');
const orders = require('../swagger/orders.json');
const payments = require('../swagger/payments.json');
const tickets = require('../swagger/tickets.json');

const router = express.Router();

router.use('/auth/docs', swaggerUi.serve);
router.get('/auth/docs', swaggerUi.setup(auth, {}));

router.use('/orders/docs', swaggerUi.serve);
router.get('/orders/docs', swaggerUi.setup(orders, {}));

router.use('/payments/docs', swaggerUi.serve);
router.get('/payments/docs', swaggerUi.setup(payments, {}));

router.use('/tickets/docs', swaggerUi.serve);
router.get('/tickets/docs', swaggerUi.setup(tickets, {}));

export { router as swaggerRouter };
