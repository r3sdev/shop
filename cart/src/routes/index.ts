import express, { Request, Response } from 'express';
import { currentUser } from '@ramsy-dev/microservices-shop-common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
  '/api/cart',
  currentUser,
  async (req: Request, res: Response) => {
    // Check if we have a cart for the current user
    if (req.currentUser) {

      const existingCart = await Cart.findOne({ userId: req.currentUser.id });
      // Return existing cart
      if (existingCart) {
        return res.send(existingCart);
      }

      const newCart = Cart.build({ userId: req.currentUser.id });

      await newCart.save();

      return res.send(newCart);
    }

    // Check if we have a cart for the current guest user
    const existingCart = await Cart.findOne({ guestId: req.session!.guestId });

    // Return existing cart
    if (existingCart) {
      return res.send(existingCart);
    }

    const newCart = Cart.build({ guestId: req.session!.guestId });

    await newCart.save();

    return res.send(newCart);

  });

export { router as indexCartRouter };
