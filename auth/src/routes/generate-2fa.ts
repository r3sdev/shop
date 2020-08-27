import express, { Response, Request } from 'express';
import { currentUser, BadRequestError } from '@ramsy-dev/microservices-shop-common';
import { generateTwoFactorAuthCode } from '../services/generate-two-factor-auth-code';
import { User } from '../models/user';
import { generateQRCode } from '../services/generate-qr-code';

const router = express.Router();

router.post(
  '/api/users/2fa/generate',
  currentUser,
  async (req: Request, res: Response) => {
    const { otpauthUrl, base32 } = generateTwoFactorAuthCode();

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new BadRequestError('Unable to enable 2FA');
    }

    user.set({ twoFactorAuthSecret: base32 });

    await user.save();

    generateQRCode(otpauthUrl!, res);
  },
);

export { router as generate2FARouter };
