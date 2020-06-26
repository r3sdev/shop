import express, { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  requireAuth,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../models/category';
import { CategoryDeletedPublisher } from '../events/publishers/category-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/categories/:id',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, { withAdmin: true }),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundError();
    }

    await new CategoryDeletedPublisher(natsWrapper.client).publish({
      id,
    });

    res.send(result);
  },
);

export { router as deleteCategoryRouter };
