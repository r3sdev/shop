import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
} from '@ramsy-it/common';
import { randomBytes } from 'crypto';

import sendEmail from '../services/send-email';
import {User} from '../models/user';

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

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.send({})
    }

    const resetPasswordToken = randomBytes(16).toString('hex');
    const date = new Date()
    const resetPasswordTokenExpires = date.setHours(date.getHours() + 2)

    user.set({ resetPasswordToken, resetPasswordTokenExpires });

    await user.save();

    const link = `${process.env.BASE_URL}/auth/reset-password/${resetPasswordToken}`;

    sendEmail({
      from: 'no_reply@ramsy.dev',
      to: email,
      subject: 'Reset password',
      text: `
We received a request to reset your password. Please create a new password by clicking this link: ${link}

This request will expire in 1 hour.

If you did not request this change, no changes have been made to your account. We recommend that you review your security settings: https://ticketing.ramsy.dev/docs/accounts/security/
`,
      html: `
We received a request to reset your password. Please create a new password by clicking this <a href="${link}">link</a><br />
<br />
This request will expire in 1 hour.<br />
<br />
If you did not request this change, no changes have been made to your account. We recommend that you review your security settings: https://ticketing.ramsy.dev/docs/accounts/security/ <br />

      `,
    });

    res.status(200).send({ user });
  },
);

export { router as forgotPasswordRouter };
