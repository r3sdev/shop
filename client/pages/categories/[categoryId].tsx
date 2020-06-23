import Router from 'next/router';

const CategoryShow = ({ category, currentUser }) => {

  const onGoBack = () => Router.push('/categories')

  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div className="card">
        <div className="card-body">

          <div>
            <h1>{category.title}</h1>
            <h4>{category.description}</h4>
            {
              !category.imageUrl
                ? <p>No image set</p>
                : <img
                  src={category.imageUrl}
                  className="col-6 rounded mx-auto d-block"
                  alt={category.imageUrl}
                />
            }
          </div>
          <button className="btn btn-primary" onClick={onGoBack}>
            Go back
      </button>

        </div>
      </div>
    </div>
  )
}

CategoryShow.getInitialProps = async (context, client) => {
  const { categoryId } = context.query;

  const { data } = await client.get(`/api/categories/${categoryId}`);

  return { category: data }
}

export default CategoryShow