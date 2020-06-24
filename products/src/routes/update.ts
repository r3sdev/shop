import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { Product } from '../models/product';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/products/:id',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next),
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (product.orderId) {
      throw new BadRequestError('Cannot edit a reserved product');
    }

    product.set({
      title: req.body.title,
      price: req.body.price,
    });

    await product.save();

    await new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      version: product.version,
      title: product.title,
      price: product.price,
      userId: product.userId,
    });

    res.send(product);
  },
);

export { router as updateProductRouter };
