import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  });

  if (req.currentUser) {
    const user = await client.get('/api/users/currentuser', {
      withCredentials: true,
    });
    console.log('requireAdmin', user);
  } else {
    console.log('requireAdmin', 'No user found');
  }

  console.debug('requireAdmin', req.currentUser);

  if (!req.currentUser?.isAdmin) {
    throw new NotAuthorizedError();
  }

  next();
};
