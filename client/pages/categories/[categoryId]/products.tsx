import React from 'react';

const CategoryProductsIndex = ({ category }) => {

  const products = category.products

  const renderProducts = products.map(product => {
    return (
      <article key={product.id}>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <h6>EUR: {product.price}</h6>
        <figure>
          <img src={product.imageUrl} style={{ height: 120 }} className="img-responsive" />
        </figure>
      </article>
    )
  })

  return (
    <div>
      <h1>{category?.title} Products</h1>
      {renderProducts}
    </div>
  )
}

CategoryProductsIndex.getInitialProps = async (context, client) => {
  const { categoryId } = context.query;

  const { data: category } = await client.get(`/api/categories/${categoryId}`)

  console.log({ categoryId, category })

  return { category }
}

export default CategoryProductsIndex