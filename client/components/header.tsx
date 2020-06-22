import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default ({ currentUser }) => {

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Products', href: '/products/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Profile', href: '/profile' },
    currentUser?.isAdmin && { label: 'Admin', href: '/admin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href}>
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    })

  return <nav className="navbar navbar-light bg-light">
    <Link href="/">
      <a className="navbar-brand">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="mr-2"
          color="#D3D3D3"
        />
        shop.ramsy.dev
      </a>
    </Link>
    <div className="d-flex justify-content-end">
      <ul className="nav d-flex align-items-center">
        {links}
      </ul>
    </div>
  </nav>
}