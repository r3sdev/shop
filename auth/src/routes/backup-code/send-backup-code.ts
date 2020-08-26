import express, { Request, Response, response } from 'express';
import {
  validateRequest,
  currentUser,
  BadRequestError,
} from '@ramsy-dev/microservices-shop-common';
import { body } from 'express-validator';
import { User } from '../../models/user';

const router = express.Router();

router.post(
  '/api/users/backup-code/send',
  [
    body('userId')
      .not()
      .isEmpty()
      .withMessage('You must supply a userId'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.phoneNumber) {
      throw new BadRequestError('Unable to send backup code');
    }

    const backupToken = Math.floor(100000 + Math.random() * 900000);

    user.set({ backupToken });
    await user.save();

    res.status(200).send({});
  },
);

export { router as sendBackupCodeRouter };
