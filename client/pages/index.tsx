import React from 'react';
import {useRouter} from 'next/router';

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
      <h1>Categories</h1>
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
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default LandingPage;
