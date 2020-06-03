import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import { asyncMiddleware } from '../middleware/async';
import { currentUser } from '@ramsy-it/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.send({ currentUser: null });
    }

    const user = await User.findById(req.currentUser!.id);

    if (user) {
      return res.send({
        currentUser: {
          ...req.currentUser,
          twoFactorAuthEnabled: user.twoFactorAuthEnabled,
        },
      });
    }

    return res.send({ currentUser: req.currentUser });
  }),
);

export { router as currentUserRouter };
