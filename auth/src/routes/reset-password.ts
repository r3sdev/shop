import express, { Response, Request, NextFunction } from 'express';
import {body} from 'express-validator';
import { User } from '../models/user';
import { validateRequest } from '@ramsy-it/common';

const router = express.Router();

router.post(
  '/api/users/reset-password',
  [
    body('resetPasswordToken')
      .trim()
      .notEmpty()
      .withMessage('You must supply valid passwordToken'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply valid password'),
    body('confirmation')
      .trim()
      .notEmpty()
      .withMessage('You must supply valid confirmation'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetPasswordToken } = req.body;

    const user = await User.findOne({ resetPasswordToken });

    return res.send({ user });
  },
);

export { router as resetPasswordRouter };
