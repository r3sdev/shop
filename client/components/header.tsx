import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router'
import Cart from './cart-icon';
import CurrentUser from '../components/current-user';
import useTheme from '../hooks/use-theme';
import type { HeaderProps } from '../types';
import { ProfileMenuContainer, BrandImage } from '../styled-components';
import { Breadcrumbs } from './breadcrumbs';

const Header = ({ currentUser, cart }: HeaderProps) => {

  const [isHovering, setHovering] = React.useState(false)

  const theme = useTheme();
  const router = useRouter();

  const pathname = router?.pathname || ''

  const isAdminRoute = pathname.startsWith("/admin");
  const isRegularRoute = !isAdminRoute
  const isAuthRoute = pathname.startsWith("/auth")
  const isProductRoute = pathname.startsWith("/product")


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
<React.Fragment>
    <Navbar
      collapseOnSelect={true} expand="lg" bg="white" variant="light" sticky="top"
      style={{ minHeight: 80 }}
    >
      {
        isAuthRoute
          ? (
            <React.Fragment>
              <Nav style={{ position: 'absolute' }}>
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
                  <BrandImage
                    src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/mygroceryph-cropped.png"
                    alt="mygroceryph.com"
                    className="img-fluid"
                  />
                </Navbar.Brand>
              </Link>
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <Link href="/">
                <Navbar.Brand>
                <BrandImage
                    src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/mygroceryph-cropped.png"
                    alt="mygroceryph.com"
                    className="img-fluid"
                  />
                </Navbar.Brand>
              </Link>

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
                                style={{ color: theme.linkColor }}
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
                <Cart
                currentUser={currentUser}
                cart={cart}
              />
              </Navbar.Collapse>
            </React.Fragment>
          )
      }
    </Navbar>
    {
      isProductRoute && (
        <Breadcrumbs />
      )
    }
    </React.Fragment>
  )
}

export {Header};