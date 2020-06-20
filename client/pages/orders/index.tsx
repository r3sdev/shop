const OrderIndex = ({ orders }) => {

  const myOrders = orders.map(order => {
    return (
      <li key={order.id}>
        {order.ticket.title} ({order.status})
      </li>
    )
  })
  return (
    <div>
      <h1>My orders</h1>
      <ul>
        {myOrders}
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data }
}

export default OrderIndex;