import express, { Request, Response, response } from 'express';
import { validateRequest, currentUser, BadRequestError, NotFoundError } from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { UserVerifyPhoneNumberPublisher } from '../events/publisher/user-verify-phone-number-publisher';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { generateTwoFactorAuthCode, generateTwoFactorAuthSecret } from '../services';

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
      throw new NotFoundError()
    }

    const {base32: phoneNumberSecret} = generateTwoFactorAuthSecret()
    const phoneNumberToken = generateTwoFactorAuthCode(phoneNumberSecret)

    user.set({ 
      phoneNumberToken, 
      phoneNumber,
      phoneNumberSecret
    });

    await user.save()

    new UserVerifyPhoneNumberPublisher(natsWrapper.client).publish({
      to: phoneNumber,
      body: `${phoneNumberToken} is your Shop verification code.`,
    });

    res.status(200).send();
  },
);

export { router as verifyPhoneNumberRouter };
