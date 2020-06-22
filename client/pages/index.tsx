import React from 'react';
import Link from 'next/link';

const LandingPage = ({ currentUser, products }) => {

  const hasProducts = products.length > 0;

  const productList = products.map(product => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href={'/products/[productId]'} as={`/products/${product.id}`}>
            <a>
              view
            </a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Products</h1>
      {
        !hasProducts
          ? <p>No products available</p>
          : <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {productList}
            </tbody>
          </table>
      }
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');

  return { products: data };
};

export default LandingPage;
