import React from 'react';
import Link from 'next/link';
import { ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import WithSidebar from '../with-sidebar';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminProductIndex = ({ currentUser, products }) => {
  const { isAdmin } = currentUser || {}

  const hasProducts = products.length > 0;

  const onDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you?')) {
      console.log('Deleting product', productId)
    }
  }

  const productList = products.map(product => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.cost}</td>
        <td>{product.category.title}</td>
        <td>{product.image}</td>
        <td>
          <ButtonGroup>
            <Link href={'/admin/products/[productId]'} as={`/admin/products/${product.id}`}>
              <button className="btn btn-outline-primary btn-sm">
                <FontAwesomeIcon icon={faEye} />
              </button>
            </Link>
            <Link href={'/admin/products/[productId]/edit'} as={`/admin/products/${product.id}/edit`}>
              <button className="btn btn-outline-primary btn-sm">
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDeleteProduct(product.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </ButtonGroup>
        </td>
      </tr>
    )
  })

  return (
    <WithSidebar currentUser={currentUser}>
      <div className="col-xs-12 col-md-12">

        <h1>Products</h1>

        <Link href={'/admin/products/new'}>
          <a className="btn btn-primary mb-5">
            Add new product
                </a>
        </Link>
        {
          !hasProducts
            ? <p>No products available</p>
            :
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead className="thead-dark">
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList}
                </tbody>
              </table>
            </div>
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