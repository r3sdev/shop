import express, { Request, Response, response } from 'express';
import {
  validateRequest,
  currentUser,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { User } from '../../models/user';

const router = express.Router();

router.post(
  '/api/users/phone-number/verification/validate',
  [
    body('phoneNumberToken')
      .isNumeric()
      .withMessage('You must supply a valid token'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { phoneNumberToken } = req.body;

    const user = await User.findOne({ phoneNumberToken });

    if (!user) {
      throw new BadRequestError('Unable to verify phone number');
    }

    user.set({ phoneNumberToken, phoneNumberVerifiedAt: new Date() });

    await user.save();

    res.status(200).send({});
  },
);

export { router as validatePhoneNumberVerificationRouter };
