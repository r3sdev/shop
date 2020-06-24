import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, NotFoundError, BadRequestError } from '@ramsy-dev/microservices-shop-common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next),
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new BadRequestError('Invalid order ID passed');
    }

    const order = await Order.findById(req.params.orderId).populate('product');

    if (!order) {
      throw new NotFoundError();
    }

    /**
     * Users cannot lookup other users orders
     */
    if (order.userId !== req.currentUser!.id) {
      throw new NotFoundError(); // NotAuthorizedError
    }

    res.send(order);
  },
);

export { router as showOrderRouter };
