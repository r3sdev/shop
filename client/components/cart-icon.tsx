import React from 'react';
import { Nav } from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import styled from 'styled-components';
import io from "socket.io-client";
import { CartIconAttrs } from '../types';


const CartBadge = styled.span`
    position: relative;
    bottom: 10px;
    right: 15px;
`

class CartIcon extends React.Component<CartIconAttrs['props'], CartIconAttrs['state']> {

    socket: SocketIOClient.Socket | undefined = undefined;

    constructor(props) {
        super(props)

        this.state = {
            products: this.props.cart?.products || []
        }
    }

    componentDidMount() {
        this.socket = io( process.env.WS_ENDPOINT!, {
            transports: ['websocket']
        });

        const cartId = this.props.cart?.id;

        if (cartId) {
            this.socket.on(cartId, data => {
                this.setState({
                    products: data
                })
            });
        }
    }

    componentWillUnmount() {
        this.socket!.disconnect()
    }

    render() {

        let count = this.state.products.length

        return (
            <Nav>
                <Link href="/cart">
                    <a>
                        <FontAwesomeIcon
                            icon={faShoppingBag}
                            size="2x"
                            className="ml-2 mr-2"
                            color={"#00ade6"}
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

export default CartIcon