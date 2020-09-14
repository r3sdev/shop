import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Cart } from '../models/cart';
import { validateRequest, NotFoundError } from '@ramsy-dev/microservices-shop-common';
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
  body('cartId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('cartId is invalid');
    }
    return true;
  }),
  body('product').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value?.id)) {
      throw new Error('Product ID missing');
    }

    if (!value.price || value.price <= 0) {
      throw new Error('Price needs to be > 0');
    }
    return true;
  }),
  validateRequest,
  async (req: RequestWithProps, res: Response) => {
    const { product, cartId } = req.body;

    const existingCart = await Cart.findById(cartId);

    if (!existingCart) {
      throw new NotFoundError();
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
