import Error from '../_error';
import WithSidebar from './with-sidebar';

const Admin = ({ currentUser }) => {

  return (
    <WithSidebar currentUser={currentUser}>
      <h1>Admin section</h1>
    </WithSidebar>
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
