import useRequest from '../../hooks/use-request';
import Error404 from '../404'

const CategoryShow = ({ category, currentUser }) => {

  const { doRequest, errors } = useRequest({
    url: `/api/categories/${category.id}`,
    method: 'put',
    body: { categoryId: category.id },
    onSuccess: () => console.log('Saved!')
  })

  return (
    <div>
      <div>
      <h1>{category.title}</h1>
      <h4>{category.description}</h4>
      {
        !category.imageUrl
          ? <p>No image set</p>
          : <img src={category.imageUrl} className="img-responsive" alt={category.imageUrl} />
      }
      </div>

      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Edit
      </button>
    </div>
  )
}

CategoryShow.getInitialProps = async (context, client) => {
  const { categoryId } = context.query;

  const { data } = await client.get(`/api/categories/${categoryId}`);

  return { category: data }
}

export default CategoryShow