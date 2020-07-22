import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Cart } from '../models/cart';
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from '@ramsy-dev/microservices-shop-common';
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
  body('products').custom((products, { req }) => {
    console.log({ products });
    if (!Array.isArray(products)) {
      throw new Error(`Products need to be of type array ${JSON.stringify(products, undefined, 2)}`);
    }

    products.forEach((product: Product, index: number) => {
      if (!mongoose.Types.ObjectId.isValid(product?.id)) {
        throw new Error(`Product-${index} needs to have a valid ID`);
      }

      if (!product.title) {
        throw new Error(`Product-${index} needs to have title`);
      }

      if (!product.price || product.price <= 0) {
        throw new Error(`Product-${index} needs to have price`);
      }
      if (!product.imageUrl) {
        throw new Error(`Product-${index} needs to have imageUrl`);
      }
    });

    return true;
  }),
  validateRequest,
  async (req: RequestWithProps, res: Response) => {
    const { id } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(id);

    if (!cart) {
      throw new BadRequestError('Unable to update cart');
    }

    // User is logged in
    if (req.currentUser) {
      if (cart.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
      }
    }
    // User is guest
    if (req.session?.guestId) {
      if (cart.guestId !== req.session?.guestId) {
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
