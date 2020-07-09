import express, { Request, Response } from 'express';
import { Cart } from '../models/cart';

const router = express.Router();

router.get('/api/cart', async (req: Request, res: Response) => {
  const carts = await Cart.find({})

  res.send(carts);
});

export { router as indexCartRouter };
