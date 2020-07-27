import React from 'react';
import Error404 from './404';

function Error({ statusCode }) {

  if (statusCode === 404) {
    return <Error404 />
  }

  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error