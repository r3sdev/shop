import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  currentUser,
  requireAuth,
} from '@ramsy-dev/microservices-shop-common';
import { User } from '../models/user';
import { verifyTwoFactorAuthCode } from '../services/verify-2fa-code';
import { setCookie } from '../services/set-cookie';

const router = express.Router();

router.post(
  '/api/users/2fa/validate',
  [
    body('userId')
      .trim()
      .notEmpty()
      .withMessage('You must supply a user ID'),
    body('userToken')
      .trim()
      .notEmpty()
      .withMessage('You must supply a user token'),
  ],
  requireAuth,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, userToken } = req.body;

    const isValidUserId = mongoose.Types.ObjectId.isValid(userId)

    if (!isValidUserId) {
      throw new BadRequestError('Invalid userId')
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotAuthorizedError();
    }

    if (!user.twoFactorAuthSecret) {
      throw new BadRequestError('Two-factor authentication is not enabled');
    }

    const isCodeValid = await verifyTwoFactorAuthCode(
      user.twoFactorAuthSecret!,
      userToken,
    );

    if (!isCodeValid) {
      throw new BadRequestError('Unable to disable two-factor authentication');
    }

    setCookie(user, req);

    res.status(200).send({ twoFactorAuthEnabled: false });
  },
);


export { router as validate2FARouter };
