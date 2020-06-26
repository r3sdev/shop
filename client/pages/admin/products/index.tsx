import React from 'react';
import Link from 'next/link';
import { ButtonGroup } from 'react-bootstrap';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

import WithSidebar from '../with-sidebar';
import useRequest from '../../../hooks/use-request';


const AdminProductIndex = ({ currentUser, products }) => {

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'delete',
    body: {},
    onSuccess: () => router.push('/admin/products')
  });

  const hasProducts = products.length > 0;

  const onDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you?')) {
      console.log('Deleting product', productId)
      doRequest({ uri: `/${productId}` })
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