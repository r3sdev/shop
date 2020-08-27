import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { User } from '../models/user';
import { verifyTwoFactorAuthenticationCode } from '../services/verify-2fa-code';
import { setCookie } from '../services/set-cookie';

const router = express.Router();

router.post(
  '/api/users/2fa/validate',
  [
    body('userId').trim().notEmpty().withMessage('You must supply a user ID'),
    body('userToken')
      .trim()
      .notEmpty()
      .withMessage('You must supply a 2FA user token'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, userToken } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.twoFactorAuthSecret) {
      throw new BadRequestError('Unable to verify 2FA');
    }

    const isCodeValid = await verifyTwoFactorAuthenticationCode(
      user.twoFactorAuthSecret!,
      userToken,
    );

    if (!isCodeValid) {
      throw new BadRequestError('Invalid token');
    }

    setCookie(user, req);

    res.status(200).send({ valid: true });
  },
);


export { router as validate2FARouter };
