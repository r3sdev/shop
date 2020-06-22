import {Subjects} from './types/subjects';

export interface CategoryCreatedEvent {
  subject: Subjects.CategoryCreated;
  data: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}