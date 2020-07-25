import { Subjects } from './types/subjects';

export interface ErrorEvent {
  subject: Subjects.Error;
  data: {
    service: string;
    statusCode: number;
    message: string;
  };
}
