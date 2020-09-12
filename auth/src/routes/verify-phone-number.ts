import express, { Request, Response, response } from 'express';
import { validateRequest, currentUser, BadRequestError, NotFoundError, NotAuthorizedError } from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { UserVerifyPhoneNumberPublisher } from '../events/publisher/user-verify-phone-number-publisher';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { generateTwoFactorAuthCode, generateTwoFactorAuthSecret } from '../services';

const router = express.Router();

const TOKEN_EXPIRES_IN_MIN = 15;
export const URL = '/api/users/phone-number/verification/request'

router.post(URL, [
    body('phoneNumber')
      .isMobilePhone('nl-NL')
      .withMessage('You must supply a valid phone number'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    try {
      const user = await User.findById(req.currentUser!.id);

      if (!user) {
        throw new NotAuthorizedError()
      }
  
      const validTime = new Date(new Date().valueOf() + TOKEN_EXPIRES_IN_MIN * 60000).getTime() / 1000;
  
      const {base32: phoneNumberSecret} = generateTwoFactorAuthSecret()
      const phoneNumberToken = generateTwoFactorAuthCode(phoneNumberSecret, validTime)
  
      user.set({ phoneNumber, phoneNumberSecret });
  
      await user.save()
  
      new UserVerifyPhoneNumberPublisher(natsWrapper.client).publish({
        to: phoneNumber,
        body: `
${phoneNumberToken} is your Shop verification code.
This will expire in ${TOKEN_EXPIRES_IN_MIN} minutes.
`,
      });
  
      res.status(200).send();
    }
    catch {
      throw new NotAuthorizedError()
    }


  },
);

export { router as verifyPhoneNumberRouter };
