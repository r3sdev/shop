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
import { Category, CategoryDoc } from '../models/category';

const router = express.Router();

router.put(
  '/api/products/:id',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, { withAdmin: true }),
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater than 0'),
    body('cost')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, cost, categoryId } = req.body;

    let category: CategoryDoc | null;
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      throw new NotFoundError();
    }

    if (product.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (product.orderId) {
      throw new BadRequestError('Cannot edit a reserved product');
    }

    // Only update the category if it's changed
    if (product.category?.id !== categoryId) {
      category = await Category.findById(categoryId);

      product.set({
        title,
        price,
        cost,
        category,
      });

      await product.save();

      await new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        version: product.version,
        title: product.title,
        price: product.price,
        cost: product.cost,
        category: category
          ? {
              id: category.id,
              title: category.title,
            }
          : undefined,
        userId: product.userId,
      });

      res.send(product);
    } else {
      //category is not changed, just use the preview value
      product.set({
        title,
        price,
        cost,
      });

      await product.save();

      await new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        version: product.version,
        title: product.title,
        price: product.price,
        cost: product.cost,
        category: product.category
          ? {
              id: product.category.id,
              title: product.category.title,
            }
          : undefined,
        userId: product.userId,
      });

      res.send(product);
    }
  },
);

export { router as updateProductRouter };
