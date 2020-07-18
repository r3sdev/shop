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

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface RequestWithProps extends Request {
  body: {
    cartId: string;
    product: ProductAttrs;
  };
}

router.post(
  '/api/cart',
  body('cartId').custom((value, { req }) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Cart needs to have a valid ID');
    }
    return true;
  }),
  body('product').custom((value, { req }) => {
    if (!mongoose.Types.ObjectId.isValid(value?.id)) {
      throw new Error('Product needs to have a valid ID');
    }

    if (!value.price || value.price <= 0) {
      throw new Error('Product needs to have a price');
    }
    return true;
  }),
  validateRequest,
  async (req: RequestWithProps, res: Response) => {
    const { product, cartId } = req.body;

    const existingCart = await Cart.findById(cartId);

    if (!existingCart) {
      throw new BadRequestError('Unable to add product');
    }

    existingCart.products.push(product);

    await existingCart.save();

    await new CartUpdatedPublisher(natsWrapper.client).publish({
      cartId: existingCart.id,
      products: existingCart.products,
    });

    return res.send({ existingCart });
  },
);

export { router as addProductCartRouter };
