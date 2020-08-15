import React from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'react-bootstrap';

import {FeaturedProducts} from '../components/featured-products'
import * as Styled from '../styled-components';


const LandingPage = ({ currentUser, products, cart }) => {

  const hasProducts = products?.length > 0;

  return (
    <div className="container-fluid pb-5">

      <Styled.BannerRow>
        <div className="w-100 bg-light mb-1">
          <img
            alt="banner"
            className="img-fluid h-100"
            src="https://via.placeholder.com/1264x300/38A6DB/FFFFFF?text=%20"
            style={{ objectFit: 'cover' }}
          />
          <Styled.BannerTextContainer className="text-white">
            <h1>This is our summer holiday</h1>
            <h3>
              Get some tips & inspiration
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
            </h3>
          </Styled.BannerTextContainer>
        </div>
      </Styled.BannerRow>
      
      <FeaturedProducts products={products} currentUser={currentUser} cart={cart}/>

      <Styled.CardRow marginTop={hasProducts ? "-8rem" : "2rem"}>
        <div className="col-md-6">
          <Card border="light" className="bg-dark text-white">
            <Card.Img src="https://via.placeholder.com/620x248/38A6DB/FFFFFF" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Title>Card title</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </div>
        <div className="col-md-6">
          <Card border="light" className="bg-dark text-white">
            <Card.Img src="https://via.placeholder.com/620x248/38A6DB/FFFFFF?text=Ad2" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Title>Card title</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </div>
      </Styled.CardRow>

      <Styled.CardRow marginTop="2rem">
        <div className="col-md-6">
          <Card border="light" className="bg-dark text-white">
            <Card.Img src="https://via.placeholder.com/620x168/38A6DB/FFFFFF?text=Ad3" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Title>Card title</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </div>
        <div className="col-md-6">
          <Card border="light" className="bg-dark text-white">
            <Card.Img src="https://via.placeholder.com/620x168/38A6DB/FFFFFF?text=Ad4" alt="Card image" />
            <Card.ImgOverlay>
              <Card.Title>Card title</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </div>
      </Styled.CardRow>
    </div>
  )
};

LandingPage.getInitialProps = async (_context, client, _currentUser, cart) => {

  const { data: categories } = await client.get('/api/categories');
  const { data: products } = await client.get('/api/products');

  return { categories, products, cart };
};

export default LandingPage;
