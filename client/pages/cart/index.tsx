import React from 'react';
import { Button } from "react-bootstrap";
import styled from 'styled-components';

import useRequest from "../../hooks/use-request";

const CartRow = styled.div`
    display: flex;
    flex: 1 1 100%;
    align-items: center;
`

const CartImage = styled.img`
    src: url(${props => props.src});
    width: 80px;
    height: 80px;
`;
const Cart = ({ cart }) => {

    const [products, setProducts] = React.useState(cart.products);

    const { doRequest, errors } = useRequest({
        url: `/api/cart/${cart.id}`,
        method: 'post',
        body: {},
        onSuccess: (result: any) => setProducts(result.products)
    });

    const handleEmptyCart = () => {
        doRequest();
    }

    return (
        <div className="d-flex flex-wrap w-100 pl-5 pr-5 pt-1">
            <CartRow>
                <h1>Cart</h1>
                {errors}
                <Button onClick={handleEmptyCart} className="ml-auto">
                    Emtpty cart
                </Button>
            </CartRow>
            {
                products.map(product => {
                    return (
                        <CartRow>
                            <CartImage src={product.imageUrl} className="img-fluid" />
                            {product.title}
                        </CartRow>
                    )
                })
            }
        </div>
    )
}

Cart.getInitialProps = async (_context, _client, _currentUser, cart) => {

    return { cart };
};


export default Cart;