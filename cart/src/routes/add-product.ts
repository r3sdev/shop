import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Cart } from '../models/cart';
import {
  validateRequest,
  BadRequestError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
import { CartUpdatedPublisher } from '../events/publishers/cart-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

interface RequestWithProps extends Request {
  body: {
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
    const { product } = req.body;

    /**
     * Logged in user
     */
    if (req.currentUser) {
      const existingCart = await Cart.findOne({ userId: req.currentUser.id });

      if (!existingCart) {
        throw new BadRequestError('Unable to add product');
      }

      existingCart.products.push(product);

      await existingCart.save();

      await new CartUpdatedPublisher(natsWrapper.client).publish({
        cartId: existingCart.id,
        products: existingCart.products,
      });

      console.log('Published CartUpdatedPublisher currentUser');

      return res.send({ currentUser: req.currentUser, existingCart });
    }

    /**
     * Guests
     */
    if (req.session?.guestId) {
      const existingCart = await Cart.findOne({
        guestId: req.session.guestId,
      });

      if (!existingCart) {
        throw new BadRequestError('Unable to add product');
      }

      existingCart.products.push(product);

      await existingCart.save();

      await new CartUpdatedPublisher(natsWrapper.client).publish({
        cartId: existingCart.id,
        products: existingCart.products,
      });

      console.log('Published CartUpdatedPublisher guest');

      return res.send({ guestId: req.session.guestId, existingCart });
    }

    throw new BadRequestError('Unable to add product');
  },
);

export { router as addProductCartRouter };
