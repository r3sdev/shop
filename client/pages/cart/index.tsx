const Cart = ({ cart }) => {
    return (
        <div>
            <h1>Cart</h1>
            <code>
                <pre>
                    {JSON.stringify(cart.products, undefined, 2)}
                </pre>
            </code>
        </div>
    )
}

Cart.getInitialProps = async (context, client, currentUser, cart) => {

    return { cart };
};


export default Cart;