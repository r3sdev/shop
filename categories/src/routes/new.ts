import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { Category } from '../models/category';
import { CategoryCreatedPublisher } from '../events/publishers/category-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/categories',
  (req: Request, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, { withAdmin: true }),
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, description, imageUrl } = req.body;

    const existingCategory = await Category.findOne({ title });

    if (existingCategory) {
      throw new BadRequestError('Category with same title already exists');
    }

    const category = Category.build({
      title,
      description,
      imageUrl,
    });
    await category.save();

    /**
     * INFO:
     *
     * In this setup and a very specific situation where we might have issues with losing the connection to NATS
     * after saving the data, we might run into data consistency issues. We do not expect that to happen.
     *
     * When we run into the issues the solution would be to save both the data and the event with a database
     * transaction which ensures both fields need to be saved. We will then add a sent flag to the event where
     * we can detect whether the event has been sent or not. We will need to implement new code to watch
     * for new database actions and process the events. That will prevent any consistency issues.
     *
     * When this is implemented we can remove the await keyword safely and gain some performance as well.
     */

    await new CategoryCreatedPublisher(natsWrapper.client).publish({
      id: category.id,
      version: category.version,
      title: category.title,
      description: category.description,
      imageUrl: category.imageUrl,
    });

    res.status(201).send(category);
  },
);

export { router as createCategoryRouter };
