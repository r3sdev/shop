import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@ramsy-dev/microservices-shop-common';
import { randomBytes } from 'crypto';

import { User } from '../models/user';
import { UserLostPasswordPublisher } from '../events/publisher/user-forgot-password-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/forgot-password',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('You must supply an email address'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Always return 204 because of security issues
      // This way we cannot guess if an email address
      // exists in the system
      return res.status(204).send()
    }

    const resetPasswordToken = randomBytes(16).toString('hex');
    const date = new Date();
    const resetPasswordTokenExpires = date.setHours(date.getHours() + 2);

    user.set({ resetPasswordToken, resetPasswordTokenExpires });

    await user.save();

    const link = `${process.env.BASE_URL}/auth/reset-password/${resetPasswordToken}`;

    new UserLostPasswordPublisher(natsWrapper.client).publish({
      email,
      link,
    });

    // Again return 204
    res.status(204).send();
  },
);

export { router as forgotPasswordRouter };
