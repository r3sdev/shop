import React from 'react';
import { useRouter } from 'next/router'
import useRequest from '../../../hooks/use-request';
import WithSidebar from '../with-sidebar';
import { Form } from 'react-bootstrap';
import * as crypto from 'crypto';
import axios from 'axios';

const NewProduct = ({ currentUser, categories }) => {

  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [image, setImage] = React.useState<File>();
  const [imageHash, setImageHash] = React.useState('');

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

  function previewFile(file: File) {
    const preview = document.querySelector('img');
    const reader = new FileReader();

    reader.addEventListener("progress", (e) => {
      console.log({ e })
    })

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      const result = reader.result;
      // @ts-ignore
      preview.src = result;

      const md5 = crypto.createHash('md5').update(result.toString()).digest("hex");
      setImageHash(md5)
    }, false);


    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const image = event.target.files[0];
    setImage(image)
    previewFile(image)
  }

  const onRemoveImage = (event: React.MouseEvent) => {
    event.preventDefault()
    setImage(null)
    setImageHash('')
  }

  React.useEffect(() => {
    if (image && imageHash) {

      const bodyFormData = new FormData();
      bodyFormData.append('file', image);

      axios({
        method: 'post',
        url: '/api/media/upload',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(function (response) {
          //handle success
          console.log(response);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

    }
  }, [image, imageHash])

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
                      !image &&
                      (
                        <React.Fragment>
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            onChange={onSelectImage}
                          />
                          <label className="custom-file-label" htmlFor="customFile">
                            {image || 'Choose file'}
                          </label>
                        </React.Fragment>
                      )}
                    <div className="d-flex flex-row justify-content-start align-items-center">
                      <img
                        className="img-responsive"
                        src="/image-placeholder.png"
                        height="100"
                        alt="Image preview..."
                        style={{ display: image ? 'inherit' : 'none' }}
                      />

                      {
                        image && (
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

                {errors}
                <button className="btn btn-primary">Add</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </WithSidebar >
  )
};

NewProduct.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/categories');

  return { categories: data };
};


export default NewProduct;