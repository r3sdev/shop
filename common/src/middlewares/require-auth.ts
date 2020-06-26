import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

interface RequireAuthOptions {
  withAdmin?: boolean;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
  options: RequireAuthOptions = {},
) => {

  // User needs to be logged in
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  // Users needs to have admin rights
  if (options.withAdmin) {
    if (!req.currentUser.isAdmin) {
      throw new NotAuthorizedError();
    }
  }

  next();
};
