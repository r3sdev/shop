import { Publisher, Subjects, UserSignedUpEvent } from '@ramsy-it/common';

export class UserSignedUpPublisher extends Publisher<UserSignedUpEvent> {
  subject: Subjects.UserSignedUp = Subjects.UserSignedUp;
}
