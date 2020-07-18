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

router.post('/api/cart/:id', async (req: Request, res: Response) => {
  const cartId = req.params.id;

  const existingCart = await Cart.findById(cartId);

  if (!existingCart) {
    throw new BadRequestError('Unable to empty cart');
  }

  existingCart.products = [];

  await existingCart.save();

  await new CartUpdatedPublisher(natsWrapper.client).publish({
    cartId: existingCart.id,
    products: existingCart.products,
  });

  res.send(existingCart)
});

export { router as emptyCartRouter };
