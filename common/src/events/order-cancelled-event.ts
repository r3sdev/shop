import { Subjects } from './types/subjects';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    product: {
      id: string;
    };
  };
}
