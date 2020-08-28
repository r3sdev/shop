import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@ramsy-dev/microservices-shop-common';

import { Password } from '../services/password';
import { User } from '../models/user';
import { setCookie } from '../services/set-cookie';
import updateTrackableFields from '../services/update-trackable-fields';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Set cookie directly when 2FA is disabled
    if (!existingUser.twoFactorAuthEnabled) {
      setCookie(existingUser, req);
    }

    const user = await updateTrackableFields(existingUser);

    res.status(200).send(user);
  },
);

export { router as signinRouter };
