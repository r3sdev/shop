import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, NotFoundError, BadRequestError } from '@ramsy-dev/microservices-shop-common';
import { setCookie } from '../services/set-cookie';

const router = express.Router();

router.get(
  '/api/users/reset-password/:token',
  async (req: Request, res: Response, next: NextFunction) => {

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
    });

    if (!user) {
      throw new NotFoundError()
    }

    if (
      !user.resetPasswordTokenExpires ||
      user.resetPasswordTokenExpires! < new Date()
    ) {
      throw new BadRequestError('Token is expired')
    }

    res.status(200).send()
  },
);

router.post(
  '/api/users/reset-password',
  [
    body('resetPasswordToken')
      .trim()
      .notEmpty()
      .withMessage('resetPasswordToken is missing'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('password is missing'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetPasswordToken, password } = req.body;

    const user = await User.findOne({ resetPasswordToken });

    if (!user) {
      throw new NotFoundError();
    }

    user.set({
      password,
      resetPasswordToken: undefined,
      resetPasswordTokenExpires: undefined,
    });

    await user.save()!;

    setCookie(user, req);

    return res.status(200).send();
  },
);

export { router as resetPasswordRouter };
