import express, { Response, Request, NextFunction } from 'express';
import {
  currentUser,
  BadRequestError,
} from '@ramsy-it/common';
import { User } from '../../models/user';

const router = express.Router();

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

export { router as disable2FARouter };
