import React from 'react';
import useRequest from '../../hooks/use-request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../styled-components';

const ProductShow = ({ product, cart }) => {

  console.log('Showing product', product, cart)

  // const { doRequest, errors } = useRequest({
  //   url: '/api/orders',
  //   method: 'post',
  //   body: { productId: product?.id },
  //   onSuccess: (order) => console.log(order)
  // })

  const { doRequest, errors } = useRequest({
    url: '/api/cart',
    method: 'post',
    body: {
      cartId: cart?.id,
    },
    onSuccess: (result) => console.log('Added Product', result)
  });


  /* Functions */

  const onAddProduct = () => {
    doRequest({ product })
  }


  return (
    <div className="p-5">
      <div className="row">
        <div className="col-md-4">
          <img src={product?.imageUrl} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <h1>{product?.title}</h1>
          <h4>Price: {product?.price}</h4>
          {errors}
          <Button onClick={onAddProduct} className="btn">
            <span className="mr-2">
            Add
            </span>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <hr />

        </div>
      </div>

    </div>
  )
}

ProductShow.getInitialProps = async (context, client, _currentUser) => {
  const { productId } = context.query;

  const { data: product } = await client.get(`/api/products/${productId}`);
  const { data: cart } = await client.get('/api/cart')

  return { product, cart }
}

export default ProductShow