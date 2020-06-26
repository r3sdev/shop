import express, { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  requireAuth,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../models/product';
import { ProductDeletedPublisher } from '../events/publishers/product-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/products/:id',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, { withAdmin: true }),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await Product.findByIdAndDelete(id)

    if (!result) {
      throw new NotFoundError();
    }


    await new ProductDeletedPublisher(natsWrapper.client).publish({
      id,
    });

    res.send(result);
  },
);

export { router as deleteProductRouter };
