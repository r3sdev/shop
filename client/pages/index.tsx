import React from 'react';
import { useRouter } from 'next/router';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
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

      <div className="row">
        <div className="w-100 bg-light mb-1">
          <img
            alt="banner"
            className="img-fluid h-100"
            src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/banner.jpg"
            style={{objectFit: 'cover'}}
          />
          <div className="text-white" style={{ position: 'absolute', top: 60, left: 10, cursor: 'pointer' }}>
            <h1>This is our summer holiday</h1>
            <h3>
              Get some tips and inspiration
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
            </h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {
            hasProducts && products.map(product => {
              return (
                <div className="col-md-2">
                  <article>
                    <figure>
                      <img src={product.imageUrl} />
                    </figure>
                  </article>
                </div>
              )
            })
          }
        </div>
      </div>

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
