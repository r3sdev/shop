const CategoryProductsIndex = ({ categoryId}) => {
  return (
    <div>
      <h1>{categoryId} Products</h1>
    </div>
  )
}

CategoryProductsIndex.getInitialProps = async (context, client) => {
  const { categoryId } = context.query;


  return { categoryId }
}

export default CategoryProductsIndex