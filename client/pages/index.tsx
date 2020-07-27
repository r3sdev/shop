import React from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

import BonusProducts from '../components/bonus-products'

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-top: ${(props: { marginTop?: number | string }) => props.marginTop ? props.marginTop : 0};
`

const BannerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`

const BannerTextContainer = styled.div`
  position: absolute; 
  top: 60px;
  left: 10px;
  cursor: pointer;
`

const LandingPage = ({ currentUser, products, cart }) => {

  const hasProducts = products?.length > 0;

  return (
    <div className="container-fluid pb-5">

      <BannerRow>
        <div className="w-100 bg-light mb-1">
          <img
            alt="banner"
            className="img-fluid h-100"
            src="https://via.placeholder.com/1264x300/38A6DB/FFFFFF?text=%20"
            style={{ objectFit: 'cover' }}
          />
          <BannerTextContainer className="text-white">
            <h1>This is our summer holiday</h1>
            <h3>
              Get some tips & inspiration
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
            </h3>
          </BannerTextContainer>
        </div>
      </BannerRow>
      
      <BonusProducts products={products} currentUser={currentUser} cart={cart}/>

      <CardRow marginTop={hasProducts ? "-8rem" : "2rem"}>
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
      </CardRow>

      <CardRow marginTop="2rem">
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
      </CardRow>
    </div>
  )
};

LandingPage.getInitialProps = async (_context, client, _currentUser, cart) => {

  const { data: categories } = await client.get('/api/categories');
  const { data: products } = await client.get('/api/products');

  return { categories, products, cart };
};

export default LandingPage;
