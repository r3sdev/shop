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
}

const CartBadge = styled.span`
    position: relative;
    bottom: 10px;
    right: 15px;
`

const Cart = ({currentUser}: CartProps) => {

    const [count, setCount] = React.useState(0)

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

export default Cart