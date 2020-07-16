import React from 'react';
import { useRouter } from 'next/router';
import { faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

import BonusProducts from '../components/product/bonus-products'

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
`

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
const LandingPage = ({ currentUser, categories, products }) => {

  const router = useRouter()

  const hasProducts = products.length > 0;

  const onSelectCategory = (category) => {
    router.push(`/categories/${category.id}/products`)
  }

  const categoryList = categories.map(category => {
    return (
      <div className="col-md-4 mb-5" key={category.id}>
        <div className="card" onClick={() => onSelectCategory(category)}>
          <img className="card-img-top" src={category.imageUrl} alt={category.title} />
          <div className="card-body">
            <h4>{category.title}</h4>
            <p className="card-text">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    )
  })

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
          <div className="text-white" style={{ position: 'absolute', top: 60, left: 10, cursor: 'pointer' }}>
            <h1>This is our summer holiday</h1>
            <h3>
              Get some tips & inspiration
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
            </h3>
          </div>
        </div>
      </BannerRow>
      
      <BonusProducts products={products} currentUser={currentUser}/>

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

LandingPage.getInitialProps = async (context, client, currentUser, cart) => {

  const { data: categories } = await client.get('/api/categories');
  const { data: products } = await client.get('/api/products');

  return { categories, products, cart };
};

export default LandingPage;
