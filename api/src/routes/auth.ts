import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/auth', async (req: Request, res: Response) => {
  res.json({
    name: 'auth',
  });
});

export { router as authRouter };
