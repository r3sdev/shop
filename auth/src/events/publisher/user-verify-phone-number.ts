import {
  Publisher,
  UserVerifyPhoneNumberEvent,
  Subjects,
} from '@ramsy-dev/microservices-shop-common';

export class UserVerifyPhoneNumberPublisher extends Publisher<
  UserVerifyPhoneNumberEvent
> {
  subject: Subjects.UserVerifyPhoneNumber = Subjects.UserVerifyPhoneNumber;
}
