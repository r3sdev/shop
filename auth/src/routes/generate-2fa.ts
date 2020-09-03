import express, { Response, Request } from 'express';
import { currentUser, NotAuthorizedError } from '@ramsy-dev/microservices-shop-common';
import { generateTwoFactorAuthSecret } from '../services/generate-2fa-secret';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/2fa/generate',
  currentUser,
  async (req: Request, res: Response) => {
    const { otpauthUrl, base32 } = generateTwoFactorAuthSecret();

    // FIXME check not only is user is removed, but if banned / no access
    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotAuthorizedError();
    }

    user.set({ twoFactorAuthSecret: base32 });

    await user.save();

    res.send({otpauthUrl})
  },
);

export { router as generate2FARouter };
