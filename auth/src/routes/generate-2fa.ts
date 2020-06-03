import express, { Response, Request } from 'express';
import { currentUser, BadRequestError } from '@ramsy-it/common';
import {
  getTwoFactorAuthenticationCode,
  respondWithQRCode,
} from '../2fa/get-2fa-code';
import { User } from '../models/user';

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

export { router as generate2FARouter };
