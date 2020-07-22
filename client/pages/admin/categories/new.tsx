import React from 'react';
import { useRouter } from 'next/router'
import useRequest from '../../../hooks/use-request';

import WithSidebar from '../with-sidebar';

const NewCategory = ({ currentUser }) => {

  const router = useRouter();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/categories',
    method: 'post',
    body: { title, description, imageUrl },
    onSuccess: () => router.push('/admin/categories')
  });

  const { doRequest: doUpload, errors: errorsUpload } = useRequest({
    url: '/api/media/upload?kind=category-image',
    method: 'post',
    onSuccess: (result: any) => setImageUrl(result.image),
    onError: (error) => console.log({ error })
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  const onCancel = (event: React.MouseEvent) => {
    event.preventDefault()

    router.push('/admin/categories')
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
    </WithSidebar>
  )
};

export default NewCategory;