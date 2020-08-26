import express, { Request, Response, response } from 'express';
import { BadRequestError } from '@ramsy-dev/microservices-shop-common';

import { User } from '../models/user';
import { setCookie } from '../services/set-cookie';

const router = express.Router();

router.get(
  '/api/users/verify-email/:token',
  async (req: Request, res: Response) => {
    const emailToken = req.params.token;

    const user = await User.findOne({ emailToken });

    if (!user) {
      return res.status(200).redirect('/auth/email/verification/error');
    }

    user.set({
      emailToken: undefined,
      emailVerifiedAt: new Date(),
    });

    await user.save();

    setCookie(user, req);

    res.status(200).redirect('/auth/email/verification/success');
  },
);

export { router as verifyEmailRouter };
