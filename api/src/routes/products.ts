import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/products', async (req: Request, res: Response) => {
  res.json({
    name: 'products',
  });
});

export { router as productsRouter };
