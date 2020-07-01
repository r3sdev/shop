import React from 'react';
import { useRouter } from 'next/router';
import { Carousel, Card } from 'react-bootstrap';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LandingPage = ({ currentUser, categories }) => {

  const router = useRouter()

  const hasCategories = categories.length > 0;

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
    <div>

      <div className="w-100 bg-light mb-1" style={{ height: 'auto', position: 'relative' }}>
        <img
          src="https://cdn-ramsy-dev.ams3.cdn.digitaloceanspaces.com/images/banner.jpg" alt="banner"
          style={{ width: '100%' }}
        />
        <div className="text-white" style={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer' }}>
          <h1>This is our summer holiday</h1>
          <h3>
            Get some tips and inspiration
            <FontAwesomeIcon icon={faAngleRight} className="ml-1" />
          </h3>
        </div>
      </div>

      <div className="container-fluid">
        {
          !hasCategories
            ? <p>No products available</p>
            : (
              <div className="card-deck">
                {categoryList}
              </div>
            )
        }
      </div>
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default LandingPage;
