import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

import WithSidebar from '../with-sidebar';
import useRequest from '../../../hooks/use-request';

const AdminCategoryIndex = ({ currentUser, categories }) => {

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/categories',
    method: 'delete',
    body: {},
    onSuccess: () => router.push('/admin/categories')
  });

  const onDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you?')) {
      console.log('Deleting category', categoryId)
      doRequest({ uri: `/${categoryId}` })
    }
  }

  const hasCategories = categories.length > 0;

  const categoryList = categories.map(category => {
    return (
      <tr key={category.id}>
        <td>{category.title}</td>
        <td>{category.description}</td>
        <td>{category.image}</td>
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
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDeleteCategory(category.id)}>
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
    </WithSidebar>
  )
};

AdminCategoryIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default AdminCategoryIndex;
