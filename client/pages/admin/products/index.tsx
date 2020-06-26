import React from 'react';
import Link from 'next/link';
import { ButtonGroup, Modal, Button } from 'react-bootstrap';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

import WithSidebar from '../with-sidebar';
import useRequest from '../../../hooks/use-request';


const AdminProductIndex = ({ currentUser, products }) => {

  const [show, setShow] = React.useState(false);
  const [productId, setProductId] = React.useState('');

  let selectedProduct = productId ? products.find(p => p.id === productId) : null

  const handleClose = () => {
    setShow(false);
    setProductId('');
  }
  const handleShow = () => setShow(true);

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'delete',
    body: {},
    onSuccess: () => router.push('/admin/products')
  });

  const hasProducts = products.length > 0;

  const onConfirmDeleteProduct = (productId: string) => {
    setProductId(productId);
    handleShow()
  }

  const onDeleteProduct = () => {
    doRequest({ uri: `/${productId}` })
    handleClose()
  }

  const ConfirmDeleteModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the following product?
          <ul className="mt-3">
            <li>
              {selectedProduct?.title}
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDeleteProduct}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
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
          <ButtonGroup className="float-right">
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
            <button className="btn btn-outline-danger btn-sm" onClick={() => onConfirmDeleteProduct(product.id)}>
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
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList}
                </tbody>
              </table>
            </div>
        }
      </div>
      {errors}
      <ConfirmDeleteModal />
    </WithSidebar>
  )
}

AdminProductIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');

  return { products: data };
};

export default AdminProductIndex