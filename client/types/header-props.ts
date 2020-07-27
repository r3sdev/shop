export interface HeaderProps {
  currentUser: any;
  cart: {
    id: string;
    products: { id: string; price: number }[];
  };
}
