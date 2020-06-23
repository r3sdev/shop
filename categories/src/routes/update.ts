import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../models/category';
import { CategoryUpdatedPublisher } from '../events/publishers/category-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/categories/:id',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, {withAdmin: true}),
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new NotFoundError();
    }

    category.set({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    });

    await category.save();

    await new CategoryUpdatedPublisher(natsWrapper.client).publish({
      id: category.id,
      version: category.version,
      title: category.title,
      description: category.description,
      imageUrl: category.imageUrl,
    });

    res.send(category);
  },
);

export { router as updateCategoryRouter };
