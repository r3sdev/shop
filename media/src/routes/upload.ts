import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@ramsy-dev/microservices-shop-common';

const router = express.Router();

router.post(
  '/api/media/upload',
  // (req: Request, res: Response, next: NextFunction) =>
  //   requireAuth(req, res, next, {withAdmin: true}),
  async (req: Request, res: Response) => {
    console.log(req.files)
    
    res.send(req.body);
  },
);

export { router as uploadRouter };
