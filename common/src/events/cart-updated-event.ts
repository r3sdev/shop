import { Subjects } from './types/subjects';

interface Product {
  id: string, 
  price: number
}

export interface CartUpdatedEvent {
  subject: Subjects.CartUpdated;
  data: {
    cartId: string;
    products: Product[]
  };
}
