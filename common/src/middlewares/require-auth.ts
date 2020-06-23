import { Request, Response, NextFunction} from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        console.log('UnAuthorized', req.currentUser)
        throw new NotAuthorizedError()
    }

    next();
}