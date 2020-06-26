import React from 'react';
import {useRouter} from 'next/router'
import useRequest from '../../../../hooks/use-request';

const EditCategory = ({ category }) => {

  const router = useRouter();

  const [title, setTitle] = React.useState(category.title);
  const [description, setDescription] = React.useState(category.description || '')
  const [imageUrl, setImageUrl] = React.useState(category.imageUrl || '')

  const { doRequest, errors } = useRequest({
    url: `/api/categories/${category.id}`,
    method: 'put',
    body: { title, description, imageUrl },
    onSuccess: () => router.push('/categories')
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    doRequest();
  }

  const onGoBack = (event: React.MouseEvent) => {
    event.preventDefault()
    router.push('/categories')
  }


  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div className="card">
        <div className="card-body">
          <h1>Edit category</h1>
          <hr />
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                onChange={e => setTitle(e.target.value)}
                onBlur={e => setTitle(e.target.value.trim())}
                value={title}
                className="form-control"
                placeholder="Enter a title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                onChange={e => setDescription(e.target.value)}
                onBlur={e => setDescription(e.target.value.trim())}
                value={description}
                className="form-control"
                placeholder="Enter a description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                onChange={e => setImageUrl(e.target.value)}
                onBlur={e => setImageUrl(e.target.value.trim())}
                value={imageUrl}
                className="form-control"
                placeholder="Enter a valid image URL"
              />
            </div>
            {errors}
            <button className="btn btn-link" onClick={onGoBack}>
              Go back
            </button>
            <button className="btn btn-primary">
              Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

EditCategory.getInitialProps = async (context, client) => {
  const { categoryId } = context.query;

  const { data } = await client.get(`/api/categories/${categoryId}`);

  return { category: data }
}

export default EditCategory