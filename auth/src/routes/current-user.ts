import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import { asyncMiddleware } from '../middleware/async';
import { currentUser } from '@ramsy-dev/microservices-shop-common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.currentUser) {
      return res.send({ currentUser: null });
    }

    try {
      const user = await User.findById(req.currentUser!.id);

      if (!user) {
        // User does not exist in database.
        // Remove cookie and return empty object
        req.session = null;

        return res.send({ currentUser: null });
      }

      res.send({
        currentUser: {
          ...req.currentUser,
          ...user!.toJSON(),
          emailVerified: !!user!.emailVerifiedAt,
          phoneNumberVerified: !!user!.phoneNumberVerifiedAt,
        },
      });
    }
    catch(err) {
      req.session = null;

      next(err)
    }

  }),
);

export { router as currentUserRouter };
