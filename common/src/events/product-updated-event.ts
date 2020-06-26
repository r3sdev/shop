import { Subjects } from './types/subjects';

export interface ProductUpdatedEvent {
  subject: Subjects.ProductUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    cost: number;
    categoryId: string;
    userId: string;
    orderId?: string;
  };
}
