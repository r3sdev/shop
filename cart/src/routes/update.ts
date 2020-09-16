import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body, check, checkSchema } from 'express-validator';
import { Cart } from '../models/cart';
import { validateRequest, BadRequestError, NotAuthorizedError, NotFoundError } from '@ramsy-dev/microservices-shop-common';
import { CartUpdatedPublisher } from '../events/publishers/cart-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface RequestWithProps extends Request {
  body: {
    products: Product;
  };
}


router.put(
  '/api/cart/:id',
  [
    body('products')
      .isArray()
      .withMessage('should be array'),
    check('products.*.id', 'product.id must be a valid id').custom(value => {
      if (!value) return false;

      return mongoose.isValidObjectId(value)
    }),
    check('products.*.title', 'product.title must be a string').isString(),
    check('products.*.price', 'product.price must be a float and > 0.0').isFloat({ gt: 0.0 }),
    check('products.*.imageUrl', 'product.imageUrl must be an URL').isURL(),
  ],
  validateRequest,
  async (req: RequestWithProps, res: Response) => {
    const { id } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(id);

    if (!cart) {
      throw new NotFoundError();
    }

    // User is logged in
    if (!!req.currentUser) {
      /* istanbul ignore else */
      if (cart.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
      }
    } else {
      // User is guest
      // guestId is always set in this case

      /* istanbul ignore else */
      if (cart.guestId !== req.session!.guestId) {
        throw new NotAuthorizedError();
      }
    }

    cart.set({ products });

    await cart.save();

    await new CartUpdatedPublisher(natsWrapper.client).publish({
      cartId: cart.id,
      products: cart.products,
    });

    return res.send(cart);
  },
);

export { router as updateCartRouter };
