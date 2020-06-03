import jwt from 'jsonwebtoken';
import {Request} from 'express';
import { UserDoc } from '../models/user';

export function setCookie(user: UserDoc, req: Request) {
  /**
   * Generate JWT
   */

  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!,
  );

  /**
   * Store JWT in cookie
   */
  req.session = {
    jwt: userJwt,
  };
}
