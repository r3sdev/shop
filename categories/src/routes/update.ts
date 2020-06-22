import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAdmin,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../models/category';
import { CategoryUpdatedPublisher } from '../events/publishers/category-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/categories/:id',
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  requireAdmin,
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
