import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ButtonGroup, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import WithSidebar from '../with-sidebar';
import useRequest from '../../../hooks/use-request';

const AdminCategoryIndex = ({ currentUser, categories }) => {

  const [show, setShow] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState('');

  let selectedCategory = categoryId ? categories.find(c => c.id === categoryId) : null

  const handleClose = () => {
    setShow(false);
    setCategoryId('');
  }
  const handleShow = () => setShow(true);

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/categories',
    method: 'delete',
    body: {},
    onSuccess: () => router.push('/admin/categories')
  });

  const onConfirmDeleteCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    handleShow()
  }

  const onDeleteCategory = () => {
    doRequest({ uri: `/${categoryId}` })
    handleClose()
  }

  const ConfirmDeleteModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the following category?
          <ul className="mt-3">
            <li>
              {selectedCategory?.title}
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDeleteCategory}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  const hasCategories = categories.length > 0;

  const categoryList = categories.map(category => {
    return (
      <tr key={category.id}>
        <td>{category.title}</td>
        <td>{category.description}</td>
        <td>
          {
            category.imageUrl
              ? <img src={category.imageUrl} alt={category.title} className="img-responsive" style={{ height: 40 }} />
              : 'No image assigned'
          }
        </td>
        <td>
          {
            category.products.length > 0
              ? (
                <Link href={`/admin/products?category=${category.id}`}>
                  <a>
                    {category.products.length.toString()}
                  </a>
                </Link>
              )
              : 'No products'
          }
        </td>
        <td>
          <ButtonGroup className="float-right">
            <Link href={'/admin/categories/[categoryId]'} as={`/admin/categories/${category.id}`}>
              <button className="btn btn-outline-primary btn-sm">
                <FontAwesomeIcon icon={faEye} />
              </button>
            </Link>
            <Link href={'/admin/categories/[categoryId]/edit'} as={`/admin/categories/${category.id}/edit`}>
              <button className="btn btn-outline-primary btn-sm">
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={() => onConfirmDeleteCategory(category.id)}>
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

        <h1>Categories</h1>

        <Link href={'/admin/categories/new'}>
          <a className="btn btn-primary mb-5">
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add new category
          </a>
        </Link>

        {
          !hasCategories
            ? <p>No categories available</p>
            : <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead className="thead-dark">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Products</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList}
                </tbody>
              </table>
            </div>
        }
      </div>
      {errors}
      <ConfirmDeleteModal />
    </WithSidebar>
  )
};

AdminCategoryIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default AdminCategoryIndex;
