import React from 'react';
import Link from 'next/link';
import { ButtonToolbar } from 'react-bootstrap';

const CategoryIndex = ({ currentUser, categories }) => {

  const { isAdmin } = currentUser || {}

  const hasCategories = categories.length > 0;

  const categoryList = categories.map(category => {
    return (
      <tr key={category.id}>
        <td>{category.title}</td>
        <td>{category.description}</td>
        <td>{category.image}</td>
        <td>
          <ButtonToolbar>
            <Link href={'/categories/[categoryId]'} as={`/categories/${category.id}`}>
              <button className="btn btn-outline-primary btn-sm">
                view
            </button>
            </Link>
            {
              isAdmin && (
                <Link href={'/categories/[categoryId]/edit'} as={`/categories/${category.id}/edit`}>
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
    <div className="col-xs-12 col-md-12">


      <h1>Categories</h1>
      {
        isAdmin && (
          <Link href={'/categories/new'}>
            <a className="btn btn-primary mb-5">
              Add new category
                </a>
          </Link>
        )
      }

      {
        !hasCategories
          ? <p>No categories available</p>
          : <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categoryList}
            </tbody>
          </table>
      }
    </div>
  )
};

CategoryIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};

export default CategoryIndex;
