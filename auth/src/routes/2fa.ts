import express, { Response, Request, NextFunction } from 'express';
import { currentUser } from '@ramsy-it/common';
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

    res.type('png');

    respondWithQRCode(otpauthUrl!, res);
  },
);

router.post(
  '/api/users/2fa/turn-on',
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    const { twoFactorAuthenticationCode } = req.body;

    const isCodeValid = verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode,
      currentUser,
    );

    if (isCodeValid) {
      await User.findByIdAndUpdate(currentUser!.id, {
        isTwoFactorAuthenticationEnabled: true,
      });
      res.status(200).send({ message: '2FA enabled' });
    } else {
      next(new Error('WrongAuthenticationTokenException'));
    }

    res.status(200);
  },
);

export { router as twoFactorAuthenticatonRouter };
