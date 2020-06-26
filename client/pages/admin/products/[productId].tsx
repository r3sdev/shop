import { useRouter } from 'next/router';
import useRequest from '../../../hooks/use-request';
import WithSidebar from '../with-sidebar';
import { EventEmitter } from 'events';

const ProductShow = ({ currentUser, product }) => {

  const router = useRouter();

  const onGoBack = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push('/admin/products')
  }
  return (
    <WithSidebar currentUser={currentUser}>
      <div>
        <h1>{product.title}</h1>
        <h4>Price: {product.price}</h4>
        <button onClick={onGoBack} className="btn btn-link">
          Back
        </button>
      </div>
    </WithSidebar>
  )
}

ProductShow.getInitialProps = async (context, client) => {
  const { productId } = context.query;

  const { data } = await client.get(`/api/products/${productId}`);

  return { product: data }
}

export default ProductShow