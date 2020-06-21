import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@ramsy-dev/microservices-shop-common';
import { Order } from '../models/order';
import {stripe} from '../stripe';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    // Make sure the order exists
    if (!order) {
      throw new NotFoundError()
    }

    // Make sure we are the owner
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    // Make sure the order is not cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order')
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100, // Stripe works uses cents
      currency: 'eur',
      source: token, // tok_visa
      description: order.id
    })

    const payment = Payment.build({
      stripeId: charge.id,
      orderId,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })

    res.status(201).send({ id: payment.id });
  },
);

export {router as createPaymentRouter}