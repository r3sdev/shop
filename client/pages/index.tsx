import React from 'react';
import { useRouter } from 'next/router';
import { faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
`

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-top: 10rem;
  margin-top: ${(props: { marginTop?: number | string }) => props.marginTop ? props.marginTop : 0};
`

const BannerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`

const ProductRow = styled.div`
  position: relative;
  top: -5rem;
  width: 100%;
  height: 300px;
  z-index: 1;
  margin: 0 -15px;
  overflow-x: auto;
  margin-top: -3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ProductDiv = styled.div`
  height: 255px;
  background: white;
  display: flex;
  flex-direction: center;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;

  &:hover {
    ox-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`

const ProductImage = styled.img`
    src: url(${props => props.src});
    width: 150px;
    height: 150px;
    position: relative;
    top: 1rem;
    left: 2rem;
`;

const ProductArticle = styled.article`
`

const ProductFigure = styled.figure`
`


const PriceRow = styled.div`
  background: white;
  display: flex;
  align-items: flex-start;
  position: absolute;
  right: 4rem;
  bottom: 4rem;
  padding: .5rem;
`
const PriceEuro = styled.span`
  font-size: 2rem;
  font-weight: bold;
`
const PriceSeperator = styled.span`
  font-size: 1rem;
  position: relative;
  top: 1.4rem;
`

const PriceCents = styled.span`
  margin-top: 7px;
  margin-left: -4px;
`

const CircleButton = styled.button`
  color: white;
  position: absolute;
  right: 2rem;
  bottom: 1rem;
`
const LandingPage = ({ currentUser, categories, products }) => {

  console.log({ categories, products })

  const router = useRouter()

  const hasCategories = categories.length > 0;
  const hasProducts = products.length > 0;

  const onSelectCategory = (category) => {
    router.push(`/categories/${category.id}/products`)
  }

  const onAddProduct = (productId: string) => {
    console.log('Adding product', productId, currentUser.id)
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
            src="https://via.placeholder.com/1264x300/38A6DB/FFFFFF?text=Banner"
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
      {
        hasProducts && (
          <ProductRow>
            {
              products.map(product => {
                const [euro, cents] = product.price.toFixed(2).split(".");

                return (
                  <div className="col-12 col-md-3" key={product.id}>
                    <ProductDiv>
                      <ProductArticle>
                        <ProductFigure>
                          <ProductImage
                            className="img-fluid"
                            src={product.imageUrl}
                            alt={product.title}
                          />
                        </ProductFigure>
                        <PriceRow>
                          <PriceEuro>{euro}</PriceEuro>
                          <PriceSeperator>▪</PriceSeperator>
                          <PriceCents>{cents}</PriceCents>
                        </PriceRow>
                        <CircleButton
                          className="btn btn-warning btn-circle"
                          onClick={() => onAddProduct(product.id)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </CircleButton>
                      </ProductArticle>
                    </ProductDiv>
                  </div>
                )
              })
            }
          </ProductRow>
        )
      }
      <CardRow marginTop="12rem">
        <div className="col-md-6">
          <Card border="light" className="bg-dark text-white">
            <Card.Img src="https://via.placeholder.com/620x248/38A6DB/FFFFFF?text=Ad1" alt="Card image" />
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

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: categories } = await client.get('/api/categories');
  const { data: products } = await client.get('/api/products');


  return { categories, products };
};

export default LandingPage;
