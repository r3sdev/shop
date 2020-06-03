import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  currentUser,
  validateRequest,
  BadRequestError,
} from '@ramsy-it/common';
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

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new BadRequestError('Unable to enable 2FA');
    }

    user.set({ twoFactorAuthSecret: base32 });

    await user.save();

    respondWithQRCode(otpauthUrl!, res);
  },
);

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

    const isCodeValid = await verifyTwoFactorAuthenticationCode(
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
      console.log('2FA', user.twoFactorAuthSecret!, userToken);
      throw new BadRequestError('Invalid token');
    }

    res.status(200).send({valid: true});
  },
);

router.post(
  '/api/users/2fa/disable',
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    const user = await User.findById(currentUser!.id);

    if (!user) {
      throw new BadRequestError('Unable to disable 2FA');
    }

    user!.set({ twoFactorAuthEnabled: false, twoFactorAuthCode: undefined });

    await user!.save();

    res.status(200).send({ message: 'Two-factor disabled' });
  },
);

export { router as twoFactorAuthenticatonRouter };
