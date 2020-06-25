import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { ButtonToolbar, DropdownButton, ButtonGroup, Dropdown, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router'

export default ({ currentUser }) => {

  const isAdmin = currentUser?.isAdmin

  const router = useRouter();

  const pathname = router?.pathname || ''

  const links = [
    currentUser?.isAdmin && { label: 'Categories', href: '/categories' },
    currentUser && { label: 'Products', href: '/products' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href}>
        <Link href={href}>
          <a className="nav-link">
            {label}
          </a>
        </Link>
      </li>
    })

  const onSelect = (uri: string) => {
    switch (uri) {
      case 'signout':
        return router.push('/auth/signout');
      default:
        router.push(`/${uri}`);
    }
  }

  return (

    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Link href="/">
        <Navbar.Brand>
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="mr-2"
            color="#D3D3D3"
          />
        shop.ramsy.dev
        </Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">

          {links}

        </Nav>
        <Nav>
          {
            currentUser
              ? (
                <NavDropdown title={
                  <>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {currentUser.fullName}
                  </>
                }
                  id="collasible-nav-dropdown2"
                  onSelect={onSelect}
                >
                  <NavDropdown.Item eventKey="profile"
                    active={pathname.includes('profile')}
                  >
                    Profile
                  </NavDropdown.Item>
                  {
                    isAdmin && (
                      <>
                        <NavDropdown.Item eventKey="admin"
                          active={pathname.includes('admin')}
                        >
                          Admin
                      </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )
                  }
                  <NavDropdown.Item eventKey="signout">
                    Sign out
                </NavDropdown.Item>
                </NavDropdown>
              )
              : (
                <>
                  <ButtonToolbar>
                    <Link href={'/auth/signin'}>
                      <button type="button" className="btn btn-link">Sign in</button>
                    </Link>
                    <Link href={'/auth/signup'}>
                      <button type="button" className="btn btn-primary">Sign up</button>
                    </Link>
                  </ButtonToolbar>
                </>
              )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}