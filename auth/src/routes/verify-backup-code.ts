import express, { Request, Response } from 'express';
import {
  validateRequest,
  currentUser,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/backup-code/verify',
  [body('backupCode').not().isEmpty().withMessage('You must supply a backupCode')],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { backupCode } = req.body;

    const user = await User.findOne({ backupCode });

    if (!user) {
      throw new BadRequestError('Unable to verify backup code');
    }

    user.set({ backupCode: undefined });
    await user.save();

    res.status(200).send({});
  },
);

export { router as verifyBackupCodeRouter };
