import {Subjects, Publisher, ExpirationCompleteEvent} from '@ramsy-it/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}