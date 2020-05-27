import express, { Response, Request } from 'express';

const router = express.Router();

router.get('/tickets', async (req: Request, res: Response) => {
  res.json({
    name: 'tickets',
  });
});

export { router as ticketsRouter };
