import { Publisher, UserForgotPasswordEvent, Subjects } from '@ramsy-it/common';

export class UserLostPasswordPublisher extends Publisher<
  UserForgotPasswordEvent
> {
  subject: Subjects.UserForgotPassword = Subjects.UserForgotPassword;
}
