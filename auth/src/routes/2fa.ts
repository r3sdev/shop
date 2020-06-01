import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { currentUser, validateRequest } from '@ramsy-it/common';
import {
  getTwoFactorAuthenticationCode,
  respondWithQRCode,
} from '../2fa/get-2fa-code';
import { User } from '../models/user';
import { verifyTwoFactorAuthenticationCode } from '../2fa/verify-2fa-code';

const router = express.Router();

router.get(
  '/api/users/2fa/generate',
  currentUser,
  async (req: Request, res: Response) => {
    const { otpauthUrl, base32 } = getTwoFactorAuthenticationCode();

    const user = await User.findByIdAndUpdate(req.currentUser!.id, {
      twoFactorAuthCode: base32,
    });

    console.log('Added twoFactorAuthCode to user', user);

    res.type('png');

    respondWithQRCode(otpauthUrl!, res);
  },
);

router.post(
  '/api/users/2fa/turn-on',
  [
    body('twoFactorAuthenticationCode')
      .trim()
      .notEmpty()
      .withMessage('You must supply a 2FA code'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    const { twoFactorAuthenticationCode } = req.body;

    const isCodeValid = verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode,
      currentUser!.id,
    );

    console.log({ isCodeValid, twoFactorAuthenticationCode });

    if (isCodeValid) {
      await User.findOneAndUpdate(
        { _id: currentUser!.id },
        {
          isTwoFactorAuthenticationEnabled: true,
        },
      );
      res.status(200).send({ message: '2FA enabled' });
    } else {
      next(new Error('WrongAuthenticationTokenException'));
    }

    res.status(200);
  },
);

export { router as twoFactorAuthenticatonRouter };
