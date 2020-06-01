import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { currentUser, validateRequest } from '@ramsy-it/common';
import {
  getTwoFactorAuthenticationCode,
  respondWithQRCode,
} from '../2fa/get-2fa-code';
import { User } from '../models/user';
import { verifyTwoFactorAuthenticationCode } from '../2fa/verify-2fa-code';

const router = express.Router();

router.post(
  '/api/users/2fa/generate',
  currentUser,
  async (req: Request, res: Response) => {
    const { otpauthUrl, base32 } = getTwoFactorAuthenticationCode();

    await User.findByIdAndUpdate(req.currentUser!.id, {
      twoFactorAuthCode: base32,
    });

    respondWithQRCode(otpauthUrl!, res);
  },
);

router.post(
  '/api/users/2fa/enable',
  [
    body('twoFactorAuthenticationCode')
      .trim()
      .notEmpty()
      .withMessage('You must supply a 2FA code'),
  ],
  currentUser,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    const { twoFactorAuthenticationCode } = req.body;

    const user = await User.findById(currentUser!.id);

    const isCodeValid = verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode,
      currentUser!.id,
    );

    if (!isCodeValid) {
      next(new Error('WrongAuthenticationTokenException'));
    }
    if (!user) {
      next(new Error('Unable to enable 2FA'));
    }

    user!.set({ isTwoFactorAuthEnabled: true });

    await user!.save();

    res.status(200).send({ message: 'Two-factor Authentication enabled' });
  },
);

router.post(
  '/api/users/2fa/disable',
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    const user = await User.findById(currentUser!.id);

    if (!user) {
      next(new Error('Unable to disable 2FA'));
    }

    user!.set({ isTwoFactorAuthEnabled: false, twoFactorAuthCode: undefined });

    await user!.save();

    res.status(200).send({ message: 'Two-factor disabled' });
  },
);

export { router as twoFactorAuthenticatonRouter };
