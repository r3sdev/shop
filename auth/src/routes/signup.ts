import express, { Request, Response, response } from 'express';
import { body } from 'express-validator';
import { randomBytes } from 'crypto';
import {validateRequest, BadRequestError} from '@ramsy-it/common';

import { User } from '../models/user';
import { UserSignedUpPublisher } from '../events/publisher/user-signed-up-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password });

    const emailToken = randomBytes(16).toString('hex');

    user.set({ emailToken });

    await user.save();

    const link = `${process.env.BASE_URL}/api/users/verify-email/${emailToken}`;

    new UserSignedUpPublisher(natsWrapper.client).publish({
      email: user.email,
      link
    })

    res.status(200).send({});
  },
);

export { router as signupRouter };
