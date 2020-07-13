import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Cart } from '../models/cart';
import {
  validateRequest,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';

const router = express.Router();

interface RequestWithProps extends Request {
  body: {
    userId?: string;
    guestId?: string;
    product: {
      id: string;
      price: number;
    };
  };
}

router.post(
  '/api/cart',
  body('product').custom((value, { req }) => {
    if (!mongoose.Types.ObjectId.isValid(value?.id)) {
      throw new Error('Product needs to have a valid ID');
    }

    if (!value.price || value.price <= 0) {
      throw new Error('Product needs to have a price');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  validateRequest,
  async (req: RequestWithProps, res: Response) => {
    const { guestId, userId, product } = req.body;

    if (!guestId && !userId) {
      throw new BadRequestError('guestId OR userId needs to be present');
    }

    if (guestId && userId) {
      throw new BadRequestError('Please specify guestId OR userId');
    }

    const cart = Cart.build({ guestId, userId, products: [product] });

    await cart.save();

    res.send(cart);
  },
);

export { router as newCartRouter };
