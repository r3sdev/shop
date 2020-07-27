interface CartProps {
  currentUser: {
    id: string;
  };
  cart: {
    id?: string;
    products: { id: string; price: number }[];
  };
}

interface CartState {
    products: CartProps['cart']['products']
}

export interface CartIconAttrs {
  props: CartProps;
  state: CartState
}
