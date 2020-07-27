export interface BonusProductAttrs {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export interface BonusProductsProps {
  products: BonusProductAttrs[];
  currentUser: any;
  cart: {
    id: string;
  };
}
