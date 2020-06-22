import { Subjects } from './types/subjects';

export interface CategoryUpdatedEvent {
  subject: Subjects.CategoryUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    description: string;
    imageUrl: string;
  };
}
