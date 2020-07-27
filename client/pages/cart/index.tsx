import React from 'react';
import { Button } from "react-bootstrap";
import styled from 'styled-components';

import useRequest from "../../hooks/use-request";
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CartRow = styled.div`
    display: flex;
    flex: 1 1 100%;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 15px;
`

const CartImage = styled.img`
    src: url(${props => props.src});
    width: 80px;
    height: 80px;
`;
const Cart = ({ cart }) => {

    const [products, setProducts] = React.useState(cart?.products);

    const hasProducts = products?.length > 0;

    const { doRequest, errors } = useRequest({
        url: `/api/cart/${cart?.id}`,
        method: 'put',
        onSuccess: (result: any) => setProducts(result.products)
    });

    const handleEmptyCart = () => {
        doRequest({ products: [] });
    }

    const handleRemoveProduct = (id: string) => {
        doRequest({ products: products.filter(p => p.id !== id) });
    }

    return (
        <div className="d-flex flex-wrap w-100 pl-5 pr-5 pt-1">
            <CartRow style={{borderBottom: 'unset'}}>
                <h1>Cart</h1>
                {errors}
                <Button onClick={handleEmptyCart} className="ml-auto">
                    Emtpty cart
                </Button>
            </CartRow>
            {
                hasProducts
                    ? (
                        products.map(product => {
                            return (
                                <CartRow key={product.id}>
                                    <CartImage src={product.imageUrl} className="img-fluid" />
                                    {product.title}
                                    <Button
                                        onClick={() => handleRemoveProduct(product.id)}
                                        className="ml-auto"
                                        variant="danger"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} size="sm"/>
                                    </Button>
                                </CartRow>
                            )
                        })
                    )
                    : (<h3>No products in cart</h3>)
            }

        </div>
    )
}

Cart.getInitialProps = async (_context, _client, _currentUser, cart) => {

    return { cart };
};


export default Cart;