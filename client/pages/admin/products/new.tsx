import React from 'react';
import {useRouter} from 'next/router'
import useRequest from '../../../hooks/use-request';
import WithSidebar from '../with-sidebar';

const NewProduct = ({currentUser}) => {

  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: { title, price },
    onSuccess: () => router.push('/products')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2))
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
                  onBlur={onBlur}
                  onChange={e => setPrice(e.target.value)}
                  className="form-control"
                />
              </div>
              {errors}
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>

        </div>
      </div>
    </div>
    </WithSidebar>
  )
};

export default NewProduct;