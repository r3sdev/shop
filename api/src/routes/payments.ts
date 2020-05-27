import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/payments', async (req: Request, res: Response) => {
  res.json({
    name: 'payments',
  });
});

export { router as paymentsRouter };
