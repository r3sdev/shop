import React from 'react';
import { useRouter } from 'next/router'
import useRequest from '../../../hooks/use-request';
import WithSidebar from '../with-sidebar';
import { Form } from 'react-bootstrap';

const NewProduct = ({ currentUser, categories }) => {

  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: { title, price, cost, imageUrl, categoryId },
    onSuccess: () => router.push('/admin/products')
  });

  const { doRequest: doUpload, errors: errorsUpload } = useRequest({
    url: '/api/media/upload?kind=product-image',
    method: 'post',
    onSuccess: (result: any) => setImageUrl(result.image),
    onError: (error) => console.log({ error })
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

  const onCancel = (event: React.MouseEvent) => {
    event.preventDefault()

    router.push('/admin/products')
  }

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const image: File = event.target.files![0];

    const bodyFormData = new FormData();
    bodyFormData?.append('image', image);

    doUpload({ formData: bodyFormData })

  }

  const onRemoveImage = (event: React.MouseEvent) => {
    event.preventDefault()
    setImageUrl('')
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

                <div className="form-group">
                  <label>Image</label>

                  <div className="custom-file">
                    {
                      !imageUrl &&
                      (
                        <React.Fragment>
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            onChange={onSelectImage}
                          />
                          <label className="custom-file-label" htmlFor="customFile">
                            {imageUrl || 'Choose file'}
                          </label>
                        </React.Fragment>
                      )}
                    <div className="d-flex flex-row justify-content-start align-items-center">
                      <img
                        className="img-responsive"
                        src={imageUrl || "/image-placeholder.png"}
                        height="100"
                        alt="Image preview..."
                        style={{ display: imageUrl ? 'inherit' : 'none' }}
                      />

                      {
                        imageUrl && (
                          <button className="btn btn-sm btn-danger ml-auto" onClick={onRemoveImage}>
                            Remove image
                          </button>
                        )
                      }
                    </div>
                  </div>
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

                {errorsUpload}
                {errors}
                <button className="btn btn-primary">Add</button>
                <button className="btn btn-link" onClick={onCancel}>
                  Cancel
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </WithSidebar >
  )
};

NewProduct.getInitialProps = async (_context, client, _currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data, client };
};


export default NewProduct;