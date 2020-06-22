import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@ramsy-dev/microservices-shop-common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestError('Invalid order ID passed');
    }

    const order = await Order.findById(orderId).populate('product');

    if (!order) {
      throw new NotFoundError();
    }

    /**
     * Users cannot lookup other users orders
     */
    if (order.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish cancel event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      product: {
        id: order.product.id,
      },
    });

    res.send(order);
  },
);

export { router as patchOrderRouter };
