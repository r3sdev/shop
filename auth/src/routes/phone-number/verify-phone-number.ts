import express, { Request, Response, response } from 'express';
import { validateRequest, currentUser, BadRequestError } from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { UserVerifyPhoneNumberPublisher } from '../../events/publisher/user-verify-phone-number';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/phone-number/verification/request',
  [
    body('phoneNumber')
      .isMobilePhone('nl-NL')
      .withMessage('You must supply a phone number'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new BadRequestError('Unable to verify phone number')
    }

    const phoneNumberToken = Math.floor(100000 + Math.random() * 900000);

    user.set({ phoneNumberToken, phoneNumber });

    await user.save()

    new UserVerifyPhoneNumberPublisher(natsWrapper.client).publish({
      to: phoneNumber,
      body: `${phoneNumberToken} is your Shop verification code.`,
    });

    res.status(200).send({});
  },
);

export { router as verifyPhoneNumberRouter };
