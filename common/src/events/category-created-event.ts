import {Subjects} from './types/subjects';

export interface CategoryCreatedEvent {
  subject: Subjects.CategoryCreated;
  data: {
    id: string;
    version: number;
    title: string;
    description: string;
    imageUrl: string;
  };
}