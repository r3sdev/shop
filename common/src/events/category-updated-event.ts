import { Subjects } from './types/subjects';

export interface ProductUpdatedEvent {
  subject: Subjects.CategoryUpdated;
  data: {
    id: string;
    version: number;
    name: string;
    image: string;
    description: string;
  };
}
