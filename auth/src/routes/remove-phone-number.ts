import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  currentUser,
  BadRequestError,
  NotAuthorizedError,
} from '@ramsy-dev/microservices-shop-common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/phone-number/remove',
  currentUser,
  async (req: Request, res: Response) => {

    const userId = req.currentUser?.id || "";
    const isValidUserId = mongoose.Types.ObjectId.isValid(userId)

    if (!isValidUserId) {
      throw new NotAuthorizedError()
    }

    const user = await User.findById(userId);

    // TODO check for permissions

    if (!user) {
      throw new NotAuthorizedError()
    }

    if (!user.phoneNumber) {
      throw new BadRequestError('Phone number has not been set')
    }

    user.set({
      phoneNumberSecret: undefined,
      phoneNumber: undefined,
      phoneNumberVerifiedAt: undefined
    });

    await user.save();

    res.status(200).send();
  },
);

export { router as removePhoneNumberRouter };
