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

    const user = await User.findById(req.currentUser!.id)

    if (!user) {
      throw new BadRequestError('Unable to enable 2FA')
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

    console.log('/api/users/2fa/enable', req.body);

    const user = await User.findById(currentUser!.id);

    if (!user || !user.twoFactorAuthSecret) {
      console.log('Unable to enable 2FA', user);
      throw new BadRequestError('Unable to enable 2FA');
    }

    const isCodeValid = await verifyTwoFactorAuthenticationCode(
      user.twoFactorAuthSecret!,
      userToken,
    );

    if (!isCodeValid) {
      console.log('BadRequestError', {
        twoFactorAuthSecret: user.twoFactorAuthSecret!,
        userToken,
        user
      });
      throw new BadRequestError('Wrong Authentication Token');
    }

    user!.set({ twoFactorAuthEnabled: true });

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
      throw new BadRequestError('Unable to disable 2FA');
    }

    user!.set({ isTwoFactorAuthEnabled: false, twoFactorAuthCode: undefined });

    await user!.save();

    res.status(200).send({ message: 'Two-factor disabled' });
  },
);

export { router as twoFactorAuthenticatonRouter };
