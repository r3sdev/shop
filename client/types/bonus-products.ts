export interface FeaturedProductAttrs {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export interface FeaturedProductsProps {
  products: FeaturedProductAttrs[];
  currentUser: any;
  cart: {
    id: string;
  };
}
