import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { validateRequest, currentUser, BadRequestError, NotAuthorizedError } from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';
import { User } from '../models/user';
import { verifyTwoFactorAuthCode } from '../services';
import { TOKEN_EXPIRES_IN_MIN } from './verify-phone-number';

const router = express.Router();

router.post('/api/users/phone-number/verification/validate', [
  body('phoneNumberToken')
    .isNumeric()
    .withMessage('phoneNumberToken is missing'),
],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { phoneNumberToken } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.currentUser?.id || "invalid")) {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotAuthorizedError();
    }

    if (!user.phoneNumberSecret) {
      throw new BadRequestError('Secret not set')
    }

    const isValid = await verifyTwoFactorAuthCode(user.phoneNumberSecret!, phoneNumberToken, TOKEN_EXPIRES_IN_MIN)

    if (!isValid) {
      throw new BadRequestError('Invalid token')
    }

    user.set({ phoneNumberVerifiedAt: new Date() });

    await user.save();

    res.status(200).send();
  },
);

export { router as validatePhoneNumberVerificationRouter };
