import React from 'react';
import Error from '../_error';
import Sidebar from './sidebar';

const WithSidebar = ({ children, currentUser }) => {

  if (!currentUser?.isAdmin) {
    return <Error statusCode={404} />
  }

  return (
    <div className="row" id="body-row">
      <Sidebar />

      <div className="col py-3">

        {children}

      </div>
    </div>
  )
}


export default WithSidebar;
