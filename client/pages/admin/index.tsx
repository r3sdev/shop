import Error from '../_error';

const Admin = ({currentUser}) => {

  if (!currentUser?.isAdmin) {
    return <Error statusCode={404} />
  }

  return (
    <div>
      <h1>Admin section</h1>
    </div>
  )
}

Admin.getInitialProps = async (context, client, currentUser) => {
  const { res } = context;

  // if (res && !currentUser?.isAdmin) {
  //   res.writeHead(301, {
  //     Location: '/'
  //   });
  //   res.end();
  // }
  return {};
}


export default Admin;
