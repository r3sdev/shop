import {
  Publisher,
  UserForgotPasswordEvent,
  Subjects,
} from '@ramsy-dev/microservices-shop-common';

export class UserLostPasswordPublisher extends Publisher<
  UserForgotPasswordEvent
> {
  subject: Subjects.UserForgotPassword = Subjects.UserForgotPassword;
}
