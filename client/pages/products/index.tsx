import React from 'react';
import Link from 'next/link';
import { ButtonToolbar } from 'react-bootstrap';

const ProductIndex = ({currentUser, products}) => {

  const hasProducts = products.length > 0;

  const productList = products.map(product => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.image}</td>
        <td>
          <ButtonToolbar>
            <Link href={'/products/[productId]'} as={`/products/${product.id}`}>
              <button className="btn btn-outline-primary btn-sm">
                view
            </button>
            </Link>
          </ButtonToolbar>
        </td>
      </tr>
    )
  })

  return (
    <div className="col-xs-12 col-md-12">

      <h1>Products</h1>

      {
        !hasProducts
          ? <p>No products available</p>
          : <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Image</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productList}
            </tbody>
          </table>
      }
    </div>
  )
}

ProductIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');

  return { products: data };
};

export default ProductIndex