import {Subjects} from './types/subjects';

export interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    cost: number;
    userId: string;
    categoryId: string;
  };
}