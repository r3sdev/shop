import React from 'react';
import Router from 'next/router'
import useRequest from '../../hooks/use-request';
import Error404 from '../404';

const NewCategory = ({ currentUser }) => {

  if (!currentUser?.isAdmin) {
    return <Error404 />
  }

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');


  const { doRequest, errors } = useRequest({
    url: '/api/categories',
    method: 'post',
    body: { title, description, imageUrl },
    onSuccess: () => Router.push('/categories')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div className="card">
        <div className="card-body">

          <div>
            <h1>Create a new category</h1>
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
                <label>Description</label>
                <input
                  value={description}
                  onBlur={e => setDescription(e.target.value.trim())}
                  onChange={e => setDescription(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={imageUrl}
                  onBlur={e => setImageUrl(e.target.value.trim())}
                  onChange={e => setImageUrl(e.target.value)}
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
  )
};

export default NewCategory;