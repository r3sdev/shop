import { NextFunction } from "express";


export const Publisher = jest.fn();

export const currentUser = jest.requireActual('@ramsy-dev/microservices-shop-common').currentUser;

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    return next();
}
export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    return next();
}

//  () => (req: Request, res: Response, next: NextFunction) => {
//     // req.user = {};
//     return next();
//   });

