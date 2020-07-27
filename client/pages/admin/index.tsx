import React from 'react';
import WithSidebar from './with-sidebar';
import { Card } from 'react-bootstrap';

const Admin = ({ 
  currentUser,
  totalProducts,
  totalCategories
 }) => {

  return (
    <WithSidebar currentUser={currentUser}>
      <h2>Dashboard</h2>
      <hr />
      <div className="row">
        <div className="col-md-2">
          <Card
            bg={'light'}
            text={'dark'}
            className="mb-2"
          >
            <Card.Header as="h5">Categories</Card.Header>
            <Card.Body>
              Total:  {totalCategories}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-2">
          <Card
            bg={'light'}
            text={'dark'}
            className="mb-2"
          >
            <Card.Header as="h5">Products</Card.Header>
            <Card.Body>
              Total:  {totalProducts} 
            </Card.Body>
            <Card.Text></Card.Text>
          </Card>
        </div>
      </div>
    </WithSidebar>
  )
}

Admin.getInitialProps = async (_context, client, _currentUser) => {

  const { data: products } = await client.get('/api/products');
  const { data: categories } = await client.get('/api/categories');

  return {
    totalProducts: products.length,
    totalCategories: categories.length
  };
}


export default Admin;
