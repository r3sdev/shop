import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
} from '@ramsy-dev/microservices-shop-common';

const router = express.Router();

router.post(
  '/api/logs',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send(req.body);
  },
);

export { router as createLogRouter };
