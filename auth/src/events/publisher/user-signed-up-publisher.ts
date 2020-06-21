import { Publisher, Subjects, UserSignedUpEvent } from '@ramsy-dev/microservices-shop-common';

export class UserSignedUpPublisher extends Publisher<UserSignedUpEvent> {
  subject: Subjects.UserSignedUp = Subjects.UserSignedUp;
}
