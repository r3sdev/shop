import React from 'react';
import Link from 'next/link';
import { Navbar } from 'react-bootstrap';
import { BrandImage } from '../../styled-components';

const AdminHeader = () => {

  return (

    <Navbar
      collapseOnSelect={true} expand="lg" bg="dark" variant="dark" sticky="top"
      style={{minHeight: 80}}
    >
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
      </React.Fragment>
    </Navbar>

  )
}

export {AdminHeader};