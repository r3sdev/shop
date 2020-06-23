import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  const client = axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  });

  const { data: user } = await client.get<{ isAdmin?: boolean }>(
    '/api/users/currentuser',
    {
      withCredentials: true,
    },
  );

  if (!user.isAdmin) {
    throw new NotAuthorizedError();
  }

  next();
};
