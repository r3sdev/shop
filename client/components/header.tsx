import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faAngleDown, faAngleUp, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router'
import styled from 'styled-components';

import Cart from '../components/cart';
import CurrentUser from '../components/current-user';
import useTheme from '../hooks/use-theme';

const ProfileMenuContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 60px;
  background: #fff;
  border-radius: 2px;
  height: 300px;
  margin: 1rem;
  width: 250px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  padding: 10px;
`

interface HeaderProps {
  currentUser: any;
  cart:{
    id: string
    products: { id: string; price: number }[]    
  }
}

const Header = ({ currentUser, cart }: HeaderProps) => {

  const [isHovering, setHovering] = React.useState(false)

  const theme = useTheme();
  const router = useRouter();

  const pathname = router?.pathname || ''

  const isRegularRoute = !pathname.startsWith("/admin")
  const isAuthRoute = pathname.startsWith("/auth")

  let timer: any;

  const handleMouseEnter = () => {
    clearTimeout(timer)
    setHovering(true)
  }

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setHovering(false)
    }, 100)
  }

  const handleClick = () => {
    setHovering(!isHovering)
  }

  const ProfileMenu = () => {
    return (
      <ProfileMenuContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div key={'/auth/signin'} onClick={handleClick}>
          <Link href={'/auth/signin'}>
            <a className="btn btn-link btn-sm">
              Sign in
              <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
            </a>
          </Link>
        </div>
      </ProfileMenuContainer>
    )
  }

  return (

    <Navbar
      collapseOnSelect={true} expand="lg" bg="white" variant="light" sticky="top"
      className="border-bottom"
    >
      {
        isAuthRoute 
        ? (
          <React.Fragment>
              <Nav style={{position: 'absolute'}}>
                <li key={'/'}>
                  <Link href={'/'}>
                    <a className="btn btn-link btn-sm">
                      <FontAwesomeIcon icon={faAngleLeft} className="mr-1" />
                      Back to shop.ramsy.dev
                    </a>
                  </Link>
                </li>
              </Nav>

              <Link href="/">
                <Navbar.Brand className="mx-auto">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="mr-2"
                    color={theme.brandColor}
                    size="lg"
                  />
                </Navbar.Brand>
              </Link>
          </React.Fragment>
        ) 
        : (
          <React.Fragment>
              <Link href="/">
                <Navbar.Brand>
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="mr-2"
                    color={theme.brandColor}
                    size="lg"
                  />
                </Navbar.Brand>
              </Link>
              <Cart
                currentUser={currentUser}
                cart={cart}
              />
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <CurrentUser currentUser={currentUser} />
                <Nav className="mr-auto">
                  {
                    isRegularRoute && (
                      currentUser
                        ? (
                          <>
                            <li key={'/products'}>
                              <Link href={'/products'}>
                                <a className="btn btn-link btn-sm">
                                  Products
                              </a>
                              </Link>
                            </li>
                            <li key={'/categories'}>
                              <Link href={'/categories'}>
                                <a className="btn btn-link btn-sm">
                                  Categories
                                </a>
                              </Link>
                            </li>
                          </>
                        )
                        : (
                          <>
                            <li key={'/auth/signin'}>
                              <a 
                                className="btn btn-link btn-sm"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={handleClick}
                                style={{color: theme.linkColor}}
                              >
                                Sign in
                                <FontAwesomeIcon 
                                  icon={isHovering ? faAngleUp : faAngleDown} 
                                  className="ml-1" 
                                />
                              </a>
                              {
                                isHovering && (
                                  <ProfileMenu />
                                )
                              }
                            </li>
                          </>
                        )
                    )
                  }
                </Nav>
              </Navbar.Collapse>
          </React.Fragment>
        )
      }
    </Navbar>

  )
}

export default Header;