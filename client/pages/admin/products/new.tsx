import React from 'react';
import { useRouter } from 'next/router'
import useRequest from '../../../hooks/use-request';
import WithSidebar from '../with-sidebar';
import { Form } from 'react-bootstrap';

const NewProduct = ({ currentUser, categories }) => {

  console.log('New Product', { categories })

  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: { title, price, cost, categoryId },
    onSuccess: () => router.push('/admin/products')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  const onBlurPrice = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2))
  }

  const onBlurCost = () => {
    const value = parseFloat(cost);

    if (isNaN(value)) {
      return;
    }

    setCost(value.toFixed(2))
  }


  const onCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value)
  }


  return (
    <WithSidebar currentUser={currentUser}>
      <div className="col-xs-12 offset-md-3 col-md-6">
        <div className="card">
          <div className="card-body">

            <div>
              <h1>Create a new product</h1>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    value={price}
                    onBlur={onBlurPrice}
                    onChange={e => setPrice(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Cost</label>
                  <input
                    value={cost}
                    onBlur={onBlurCost}
                    onChange={e => setCost(e.target.value)}
                    className="form-control"
                  />
                </div>

                <Form.Group controlId="product-category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" onChange={onCategorySelect} value={categoryId}>
                    <option key="default-category-value" disabled={true} value={""}>
                      -- select a category --
                    </option>

                    {categories.map(category =>
                      <option value={category.id} key={category.id}>
                        {category.title}
                      </option>
                    )}
                  </Form.Control>
                </Form.Group>

                {errors}
                <button className="btn btn-primary">Add</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </WithSidebar>
  )
};

NewProduct.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};


export default NewProduct;