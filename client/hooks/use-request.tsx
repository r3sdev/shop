import React from 'react';
import axios from 'axios';

interface UseRequestAttrs<D> {
  url: string;
  method: string;
  body?: Record<string, any>
  onSuccess: (data: D) => void
  onError?: (err: Error) => void
}

interface DoRequestAttrs {
  uri?: string
  // Allows any
  [key: string]: any
}

const useRequest = <D extends {}>({ url, method, body, onSuccess, onError }: UseRequestAttrs<D>) => {

  const [errors, setErrors] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const doRequest = async (props: DoRequestAttrs = {},) => {
    setLoading(true)
    try {
      setErrors(null);

      const { uri, ...rest } = props;

      let _url = uri ? `${url}${uri}` : url
      const response = await axios[method](_url,
        { ...body, ...rest }
      );

      if (onSuccess) {
        onSuccess(response.data);
        setLoading(false)
      }

      return response.data;
    } catch (err) {
      setLoading(false)
      onError && onError(err);
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
    loading,
  };
};

export default useRequest
