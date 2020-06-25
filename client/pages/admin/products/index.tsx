import React from 'react';
import Link from 'next/link';
import { ButtonToolbar } from 'react-bootstrap';
import WithSidebar from '../with-sidebar';

const AdminProductIndex = ({ currentUser, products }) => {
  const { isAdmin } = currentUser || {}

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
            {
              isAdmin && (
                <Link href={'/products/[productId]/edit'} as={`/products/${product.id}/edit`}>
                  <button className="btn btn-outline-primary btn-sm">
                    edit
                </button>
                </Link>
              )
            }
          </ButtonToolbar>
        </td>
      </tr>
    )
  })

  return (
    <WithSidebar currentUser={currentUser}>
    <div className="col-xs-12 col-md-12">

      <h1>Products</h1>
      {
        isAdmin && (
          <Link href={'/products/new'}>
            <a className="btn btn-primary mb-5">
              Add new product
                </a>
          </Link>
        )
      }

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
    </WithSidebar>
  )
}

AdminProductIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');

  return { products: data };
};

export default AdminProductIndex