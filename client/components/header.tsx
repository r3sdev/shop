import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { ButtonToolbar, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import Router from 'next/router';

export default ({ currentUser }) => {

  const isAdmin = currentUser?.isAdmin

  const pathname = Router.router?.pathname || ''

  const links = [
    currentUser && { label: 'Products', href: '/products' },
    currentUser?.isAdmin && { label: 'Categories', href: '/categories' },
    currentUser && { label: 'Orders', href: '/orders' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href}>
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    })

  const onSelect = (eventKey: string) => {
    switch (eventKey) {
      case 'profile':
        return Router.push('/profile');
      case 'admin':
        return Router.push('/admin');
      case 'signout':
        return Router.push('/auth/signout');
    }
  }

  return <nav className="navbar sticky-top navbar-light bg-light">
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
        {
          !currentUser
            ? (
              <ButtonToolbar>
                <Link href={'/auth/signin'}>
                  <button type="button" className="btn btn-link">Sign in</button>
                </Link>
                <Link href={'/auth/signup'}>
                  <button type="button" className="btn btn-primary">Sign up</button>
                </Link>
              </ButtonToolbar>
            )
            : (
              <DropdownButton
                onSelect={onSelect}
                as={ButtonGroup}
                id="auth-dropdown"
                variant="primary"
                title={
                  <>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {currentUser.fullName}
                  </>
                }
              >
                <Dropdown.Item eventKey="profile"
                  active={pathname.includes('profile')}
                >
                  Profile
                  </Dropdown.Item>
                {
                  isAdmin && (
                    <>
                      <Dropdown.Item eventKey="admin"
                        active={pathname.includes('admin')}
                      >
                        Admin
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )
                }
                <Dropdown.Item eventKey="signout">
                  Sign out
                </Dropdown.Item>
              </DropdownButton>
            )
        }
      </ul>
    </div>
  </nav>
}