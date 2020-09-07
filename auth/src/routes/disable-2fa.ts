import express, { Response, Request, NextFunction } from 'express';
import { currentUser, NotAuthorizedError, BadRequestError } from '@ramsy-dev/microservices-shop-common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/2fa/disable',
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;

    // User is not logged in
    if (!currentUser) {
      throw new NotAuthorizedError()
    }

    const user = await User.findById(currentUser!.id);

    // User does no longer exist
    // FIXME check permissions here
    if (!user) {
      throw new NotAuthorizedError()
    }

    if(!user.twoFactorAuthEnabled) {
      throw new BadRequestError('Two-factor authentication is not enabled')
    }

    user!.set({ twoFactorAuthEnabled: false, twoFactorAuthCode: undefined });

    await user!.save();

    res.status(200).send({ message: 'Two-factor authentication disabled' });
  },
);

export { router as disable2FARouter };
