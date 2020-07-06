import React from 'react';
import { useRouter } from 'next/router';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
`

const BannerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: 15rem;
`

const ProductRow = styled.div`
  position: absolute;
  top: 18rem;
  width: 100%;
  height: 300px;
  z-index: 1;
  margin: 0 -15px;
  overflow-x: auto;
`
const ProductDiv = styled.div`
  max-width: 255px;
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
`;

const ProductArticle = styled.article`
`

const ProductFigure = styled.figure`
`

const LandingPage = ({ currentUser, categories, products }) => {

  console.log({ categories, products })

  const router = useRouter()

  const hasCategories = categories.length > 0;
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
    <div className="container-fluid">

      <BannerRow>
        <div className="w-100 bg-light mb-1">
          <img
            alt="banner"
            className="img-fluid h-100"
            src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/banner.jpg"
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

        <ProductRow>
        <div className="col-md-12">
          <div className="d-flex justify-content-around align-items-center">
            {
              hasProducts && products.map(product => {
                return (
                  <div className="col-md-3">
                    <ProductDiv>
                      <ProductArticle>
                        <ProductFigure>
                          <ProductImage src={product.imageUrl} alt={product.title} />
                        </ProductFigure>
                      </ProductArticle>
                    </ProductDiv>
                  </div>
                )
              })
            }
          </div>
          </div>
        </ProductRow>

      <div className="row">
        <div className="col-md-12">
          {
            !hasCategories
              ? <Title>No products available</Title>
              : (
                <div className="card-deck">
                  {categoryList}
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: categories } = await client.get('/api/categories');
  const { data: products } = await client.get('/api/products');


  return { categories, products };
};

export default LandingPage;
