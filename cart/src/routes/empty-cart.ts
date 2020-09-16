import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@ramsy-dev/microservices-shop-common';
import { Cart } from '../models/cart';
import { CartUpdatedPublisher } from '../events/publishers/cart-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

/**
 * Remove all products from the cart
 */

router.post('/api/cart/:id', async (req: Request, res: Response) => {
  const cartId = req.params.id;

  if (!mongoose.isValidObjectId(cartId)) {
    throw new BadRequestError("/api/cart/:id is invalid")
  }

  const existingCart = await Cart.findById(cartId);

  if (!existingCart) {
    throw new NotFoundError()
  }

  // FIXME move this to the update function
  existingCart.products = [];

  await existingCart.save();

  await new CartUpdatedPublisher(natsWrapper.client).publish({
    cartId: existingCart.id,
    products: existingCart.products,
  });

  res.send(existingCart)
});

export { router as emptyCartRouter };
