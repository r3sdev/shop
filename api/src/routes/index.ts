import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({
    apiVersion: 0.1,
    name: 'api.ramsy.dev',
    endpoints: [
      '/',
      '/auth',
      '/auth/docs',
      '/orders',
      '/orders/docs',
      '/payments',
      '/payments/docs',
      '/tickets',
      '/tickets/docs',
    ],
  });
});

export { router as indexRouter };
