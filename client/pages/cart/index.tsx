import React from 'react';
import { Button } from "react-bootstrap";
import useRequest from "../../hooks/use-request";

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
        <div>
            <h1>Cart</h1>
            {errors}
            <Button onClick={handleEmptyCart}>
                Emtpty cart
            </Button>
            <code>
                <pre>
                    {JSON.stringify(products, undefined, 2)}
                </pre>
            </code>
        </div>
    )
}

Cart.getInitialProps = async (context, client, currentUser, cart) => {

    return { cart };
};


export default Cart;