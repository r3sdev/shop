import { Subjects } from './types/subjects';

export interface CategoryDeletedEvent {
  subject: Subjects.CategoryDeleted;
  data: {
    id: string;
  };
}
