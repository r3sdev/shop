import express, { Response, Request, NextFunction } from 'express';
import { requireAuth } from '@ramsy-it/common';
import {
  getTwoFactorAuthenticationCode,
  respondWithQRCode,
} from '../2fa/get-2fa-code';
import { User } from '../models/user';
import { verifyTwoFactorAuthenticationCode } from '../2fa/verify-2fa-code';

const router = express.Router();

router.post(
  '/api/2fa/generate',
  requireAuth,
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
  '/api/2fa/turn-on',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
  const { twoFactorAuthenticationCode } = req.body;

    const isCodeValid = verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, req.currentUser!)

    res.status(200);
  },
);

export { router as twoFactorAuthenticatonRouter };
