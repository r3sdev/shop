import {Subjects, Publisher, ExpirationCompleteEvent} from '@ramsy-dev/microservices-shop-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}