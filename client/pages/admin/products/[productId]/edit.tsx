import React from 'react';
import { useRouter } from 'next/router'
import useRequest from '../../../../hooks/use-request';
import WithSidebar from '../../with-sidebar';
import { Form } from 'react-bootstrap';

const EditProduct = ({ currentUser, product, categories }) => {

  console.log('Edit Product', { product })

  const router = useRouter();

  const [title, setTitle] = React.useState(product.title);
  const [price, setPrice] = React.useState(product.price);
  const [cost, setCost] = React.useState(product.cost);
  const [categoryId, setCategoryId] = React.useState(product.category.id);

  const { doRequest, errors } = useRequest({
    url: `/api/products/${product.id}`,
    method: 'put',
    body: { title, price, cost, categoryId },
    onSuccess: () => router.push('/admin/products')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    console.log({ title, price, cost, categoryId})
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
              <h1>Edit product</h1>
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
                    <option key="default-category-value" disabled={true} value="default-category-value">
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
                <button className="btn btn-primary">Save</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </WithSidebar>
  )
};

EditProduct.getInitialProps = async (context, client, currentUser) => {
  const { productId } = context.query;

  const { data: product } = await client.get(`/api/products/${productId}`);
  const { data: categories } = await client.get('/api/categories');

  return { product, categories };
};


export default EditProduct;