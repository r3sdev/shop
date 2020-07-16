import React from 'react';
import { Nav } from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import styled from 'styled-components';


interface CartProps {
    currentUser: {
        id: string;
    }
    cart:{
        products: { id: string, price: number }[]
    }
}

const CartBadge = styled.span`
    position: relative;
    bottom: 10px;
    right: 15px;
`

class Cart extends React.Component<CartProps, CartProps['cart']> {

    socket: any

    constructor(props) {
        super(props)

        this.state = {
            products: this.props.cart?.products || []
        }
    }

    componentDidMount() {
        console.log('Cart mounted', this.props)
    }

    render(){

        let count = this.state.products.length

        return (
            <Nav>
                <Link href="/cart">
                    <a>
                        <FontAwesomeIcon
                            icon={faShoppingBag}
                            size="2x"
                            className="ml-2 mr-2 text-warning"
                        />
                        <CartBadge className="badge badge-dark">
                            {count}
                        </CartBadge>
                    </a>
                </Link>
            </Nav>
        )
    }
}

export default Cart