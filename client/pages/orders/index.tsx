import React from 'react';

const OrderIndex = ({ orders }) => {

  const hasNoOrders = orders?.length === 0;

  const myOrders = hasNoOrders
    ? <li>You have not placed any orders</li>
    : orders?.map(order => (
      <li key={order.id}>
        {order.product.title} ({order.status})
      </li>
    ))

  return (
    <div>
      <h1>My orders</h1>
      <ul>
        {myOrders}
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (_context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data }
}

export default OrderIndex;