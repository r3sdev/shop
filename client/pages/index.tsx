import React from 'react';
import Link from 'next/link';

const LandingPage = ({ currentUser, categories }) => {

  const hasCategories = categories.length > 0;

  const categoryList = categories.map(category => {
    return (
      <div className="card" style={{ width: '18rem' }}>
        <img className="card-img-top" src={category.imageUrl} alt={category.title} />
        <div className="card-body">
          <h3>{category.title}</h3>
          <p className="card-text">
            {category.description}
          </p>
        </div>
      </div>
    )
  })

  return (
    <div>
      <h1>Categories</h1>
      {
        !hasCategories
          ? <p>No products available</p>
          : (
            <div className="card-columns">
              {categoryList}
            </div>
          )
      }
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default LandingPage;
