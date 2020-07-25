import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
} from '@ramsy-dev/microservices-shop-common';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/products',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('cost').isFloat({ gt: 0 }).withMessage('Cost must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send(req.body);
  },
);

export { router as createProductRouter };
