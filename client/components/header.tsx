import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faAngleRight, faAngleLeft, faRocket, faHeart, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router'
import Cart from './cart-icon';
import CurrentUser from '../components/current-user';
import useTheme from '../hooks/use-theme';
import type { HeaderProps } from '../types';
import { ProfileMenuContainer, BrandImage } from '../styled-components';
import { Breadcrumbs } from './breadcrumbs';

import styled from 'styled-components';

const Textspan = styled.span`
  color: #4c8c35;
`

const HeaderLink = styled.a`
  color: black;
  padding-left: 1.5rem;
  cursor: pointer;
  font-weight: 200;

  &:hover {
    color: #838383;
    text-decoration: none; /* no underline */
  }
  &:focus {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:active {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:visited {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:link {
    color: black;
    text-decoration: none; /* no underline */
  }
`

const MenuItem = styled.a`
  display: flex;
  flex-direct: row;
  align-items: center;
  color: ${(props: {isLoggedIn?: boolean}) => props.isLoggedIn ? 'rgb(48,48,48)' : 'rgb(172, 172, 172)'};
  padding-left: 1.5rem;
  cursor: pointer;
  font-weight: 200;
  width: 100%;
  height: 42.25px;

  &:hover {
    color: ${(props: {isLoggedIn?: boolean}) => props.isLoggedIn ? 'rgb(131,131,131)' : '#838383'};
    text-decoration: none; /* no underline */
  }
  &:focus {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:active {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:visited {
    color: black;
    text-decoration: none; /* no underline */
  }
  &:link {
    color: black;
    text-decoration: none; /* no underline */
  }
`

const Header = ({ currentUser, cart }: HeaderProps) => {

  const [isHovering, setHovering] = React.useState(false)

  const theme = useTheme();
  const router = useRouter();

  const pathname = router?.pathname || ''

  const isAdminRoute = pathname.startsWith("/admin");
  const isRegularRoute = !isAdminRoute
  const isAuthRoute = pathname.startsWith("/auth")
  const isProductRoute = pathname.startsWith("/product")
  const isLoggedIn = !!currentUser;

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

  const UserMenu = () => {
    return (
      <ProfileMenuContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <MenuItem isLoggedIn={isLoggedIn}>
          <FontAwesomeIcon icon={faRocket} fixedWidth className="mr-3" />
          <span>Previously purchased</span>
        </MenuItem>
        <MenuItem isLoggedIn={isLoggedIn}>
          <FontAwesomeIcon icon={faHeart} fixedWidth className="mr-3" />
          <span>My favorites</span>
        </MenuItem>
        <MenuItem isLoggedIn={isLoggedIn}>
          <FontAwesomeIcon icon={faTruck} fixedWidth className="mr-3" />
          <span>My orders</span>
        </MenuItem>
        <MenuItem isLoggedIn={isLoggedIn}>
          <FontAwesomeIcon icon={faUser} fixedWidth className="mr-3" />
          <span>My profile</span>
        </MenuItem>
        {
          isLoggedIn
            ?
            <div key={'/auth/signout'} onClick={handleClick}>
              <Link href={'/auth/signout'}>
                <MenuItem style={{ color: theme.linkColor }}>
                  Sign out
              <FontAwesomeIcon icon={faAngleRight} className="ml-2" />
                </MenuItem>
              </Link>
            </div>
            :
            <div key={'/auth/signin'} onClick={handleClick}>
              <Link href={'/auth/signin'}>
                <MenuItem style={{ color: theme.linkColor }}>
                  Sign in
              <FontAwesomeIcon icon={faAngleRight} className="ml-2" />
                </MenuItem>
              </Link>
            </div>
        }

      </ProfileMenuContainer>
    )
  }

  const ProfileMenuLink = () => {
    return (
      <>
        <li key={'/auth/signin'}>
          <HeaderLink
            className="mr-5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ color: theme.linkColor }}
          >
            {
              isLoggedIn
                ?
                <>
                  <Textspan className="mr-1">of</Textspan>
                  <Textspan>{currentUser.fullName}</Textspan>
                </>
                :
                <span>
                  Sign in
                </span>
            }

            <FontAwesomeIcon
              icon={isHovering ? faAngleUp : faAngleDown}
              className="ml-1"
            />
          </HeaderLink>
          {isHovering && (
            <UserMenu />
          )}
        </li>
      </>
    )
  }

  const HeaderLinks = () => {
    return (
      <>
        <li key={'/products'}>
          <Link href={'/products'}>
            <HeaderLink>
              Products
            </HeaderLink>
          </Link>
        </li>
        <li key={'/bonus'}>
          <Link href={'/bonus'}>
            <HeaderLink>
              Bonus
            </HeaderLink>
          </Link>
        </li>
        <li key={'/recipes'}>
          <Link href={'/recipes'}>
            <HeaderLink>
              Recipes
            </HeaderLink>
          </Link>
        </li>
        <li key={'/stores'}>
          <Link href={'/stores'}>
            <HeaderLink>
              Stores
            </HeaderLink>
          </Link>
        </li>
        <li key={'/more'}>
          <Link href={'/more'}>
            <HeaderLink>
              More
            </HeaderLink>
          </Link>
        </li>
      </>
    )
  }

  const GoBackHeader = () => {
    return (
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
              <GoBackHeader />
            )
            : (
              <React.Fragment>
                <Link href="/">
                  <Navbar.Brand className="m-0 p-0 pb-2">
                    <BrandImage
                      src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/mygroceryph-cropped.png"
                      alt="mygroceryph.com"
                      className="img-fluid"
                    />
                  </Navbar.Brand>
                </Link>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <ProfileMenuLink />
                    <HeaderLinks />
                  </Nav>
                  <Nav>
                    <input type="search" className="form-control" placeholder="Search" />
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

export { Header };