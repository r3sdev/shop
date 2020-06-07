import {
  Publisher,
  UserVerifyPhoneNumberEvent,
  Subjects,
} from '@ramsy-it/common';

export class UserVerifyPhoneNumberPublisher extends Publisher<
  UserVerifyPhoneNumberEvent
> {
  subject: Subjects.UserVerifyPhoneNumber = Subjects.UserVerifyPhoneNumber;
}
