import { Subjects } from './types/subjects';

export interface ProductUpdatedEvent {
  subject: Subjects.ProductDeleted;
  data: {
    id: string;
  };
}
