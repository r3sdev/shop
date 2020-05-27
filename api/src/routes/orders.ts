import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/orders', async (req: Request, res: Response) => {
  res.json({
    name: 'orders',
  });
});

export { router as ordersRouter };
