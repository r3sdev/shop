import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: Function) {
  console.debug(
    `[${req.ip}] `,
    new Date().toUTCString(), 
    ' - ', 
    req.method,
    '\t',
    req.url,
  );
  next();
};