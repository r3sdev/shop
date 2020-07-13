import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@ramsy-dev/microservices-shop-common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
  '/api/cart',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, { withAdmin: true }),
  async (req: Request, res: Response) => {
    const carts = await Cart.find({});

    res.send(carts);
  },
);

export { router as indexCartRouter };
