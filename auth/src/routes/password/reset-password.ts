import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import {
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { setCookie } from '../../services/set-cookie';

const router = express.Router();

router.get(
  '/api/users/reset-password/:token',
  async (req: Request, res: Response, next: NextFunction) => {
    let error = null;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
    });

    if (!user) {
      error = 'NotFound';
    }

    if (user?.resetPasswordTokenExpires) {
      const linkExpired = user!.resetPasswordTokenExpires < new Date();
      if (linkExpired) {
        error = 'LinkExpired';
      }
    }

    res.send({ error });
  },
);

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

    return res.send({});
  },
);

export { router as resetPasswordRouter };
