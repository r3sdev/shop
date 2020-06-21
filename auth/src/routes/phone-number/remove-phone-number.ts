import express, { Request, Response, response } from 'express';
import {
  currentUser,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { User } from '../../models/user';

const router = express.Router();

router.post(
  '/api/users/phone-number/remove',
  currentUser,
  async (req: Request, res: Response) => {

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new BadRequestError('Unable to remove phone number');
    }

    user.set({
      phoneNumberToken: undefined,
      phoneNumber: undefined,
      phoneNumberVerifiedAt: undefined
    });

    await user.save();

    res.status(200).send({});
  },
);

export { router as removePhoneNumberRouter };
