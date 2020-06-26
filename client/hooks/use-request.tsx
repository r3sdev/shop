import React from 'react';
import axios from 'axios';

interface DoRequestProps {
  uri?: string

  [key: string]: any
}

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = React.useState(null);

  const doRequest = async (props: DoRequestProps = {},) => {
    try {
      setErrors(null);

      const { uri, ...rest } = props;

      let _url = uri ? `${url}${uri}` : url
      const response = await axios[method](_url,
        { ...body, ...rest }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops.....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return {
    doRequest,
    errors,
  };
};
