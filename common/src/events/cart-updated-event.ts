import { Subjects } from './types/subjects';

export interface CartUpdatedEvent {
  subject: Subjects.CartUpdated;
  data: {
    cartId: string;
    products: {id: string, price: number}[]
  };
}
