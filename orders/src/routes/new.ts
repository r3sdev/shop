import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

/**
 * We can also set this as an environment variable or save it in the database
 * so we can easily change it.
 */
const EXPIRATION_WINDOW_IN_MINUTES = Number(process.env.EXPIRATION_WINDOW_IN_MINUTES) || 15;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('productId')
      .not()
      .isEmpty()
      /**
       * Check if we have provided a valid Mongo ID
       * This creates a loose coupling with products
       */
      .custom((input: string): boolean =>
        mongoose.Types.ObjectId.isValid(input),
      )
      .withMessage('Product ID must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { productId } = req.body;

    // Find the product the user is trying to order in the database
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError();
    }

    /**
     * Make sure that this product is not already reserved.
     */
    const isReserved = await product.isReserved();

    if (isReserved) {
      throw new BadRequestError('Product is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + (EXPIRATION_WINDOW_IN_MINUTES * 60),
    );

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product,
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      product: {
        id: order.product.id,
        price: order.product.price,
      },
    });

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
