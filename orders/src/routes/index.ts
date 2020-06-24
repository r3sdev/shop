import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@ramsy-dev/microservices-shop-common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next),
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('product');

    res.send(orders);
  },
);

export { router as indexOrderRouter };
