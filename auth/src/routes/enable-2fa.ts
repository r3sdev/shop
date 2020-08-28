import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  currentUser,
  validateRequest,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { User } from '../models/user';
import { verifyTwoFactorAuthCode } from '../services/verify-2fa-code';

const router = express.Router();

router.post(
  '/api/users/2fa/enable',
  [
    body('userToken')
      .trim()
      .notEmpty()
      .withMessage('You must supply a 2FA user token'),
  ],
  currentUser,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    const { userToken } = req.body;

    const user = await User.findById(currentUser!.id);

    if (!user || !user.twoFactorAuthSecret) {
      throw new BadRequestError('Unable to enable 2FA');
    }

    const isCodeValid = await verifyTwoFactorAuthCode(
      user.twoFactorAuthSecret!,
      userToken,
    );

    if (!isCodeValid) {
      throw new BadRequestError('Invalid token');
    }

    user!.set({ twoFactorAuthEnabled: true });

    await user!.save();

    res.status(200).send({ message: 'Two-factor Authentication enabled' });
  },
);

export { router as enable2FARouter };
