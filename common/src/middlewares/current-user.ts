import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {v4} from 'uuid';

/**
 * The interface describes the UserPayload
 * interface
 */
interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean
}

/**
 * This interface extends the current Express
 * Request interface
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) {

    if(!req.session?.guestId) {
      req.session = {
        guestId: v4()
      }
    }

    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!,
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
