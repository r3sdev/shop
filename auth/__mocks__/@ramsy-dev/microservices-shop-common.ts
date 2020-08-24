export const Publisher = jest.fn();

export const UserForgotPasswordEvent = jest.requireActual('@ramsy-dev/microservices-shop-common').UserForgotPasswordEvent;
export const Subjects = jest.requireActual('@ramsy-dev/microservices-shop-common').Subjects;
export const currentUser = jest.requireActual('@ramsy-dev/microservices-shop-common').currentUser;
export const validateRequest = jest.requireActual('@ramsy-dev/microservices-shop-common').validateRequest;
export const errorHandler = jest.requireActual('@ramsy-dev/microservices-shop-common').errorHandler;
export const BadRequestError = jest.requireActual('@ramsy-dev/microservices-shop-common').BadRequestError;