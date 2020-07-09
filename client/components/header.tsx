import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router'

import Cart from '../components/cart';
import CurrentUser from '../components/current-user';

export default ({ currentUser }) => {

  const router = useRouter();

  const pathname = router?.pathname || ''

  const isRegularRoute = !pathname.startsWith("/admin")

  const links = [
    (!currentUser && isRegularRoute) && { label: 'Sign In', href: '/auth/signin' },
    (currentUser && isRegularRoute) && { label: 'Categories', href: '/categories' },
    (currentUser && isRegularRoute) && { label: 'Products', href: '/products' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href}>
        <Link href={href}>
          <a className="btn btn-link btn-sm">
            {label}
          </a>
        </Link>
      </li>
    })

  return (

    <Navbar
      collapseOnSelect={true} expand="lg" bg="white" variant="light" sticky="top"
      className="border-bottom"
    >
      <Link href="/">
        <Navbar.Brand>
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="mr-2"
            color="#38A6DB"
            size="lg"
          />
        </Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <CurrentUser currentUser={currentUser}/>
        <Nav className="mr-auto">
          {links}
        </Nav>

        <Cart currentUser={currentUser} />
      </Navbar.Collapse>
    </Navbar>

  )
}