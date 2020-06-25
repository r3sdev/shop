import React from 'react';
import {useRouter} from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {

  const router = useRouter();

  const [email, setEmail] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/forgot-password',
    method: 'post',
    body: { email },
    onSuccess: () => {
      router.push('/auth/signin')
    }
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  return (
    <div className="col-xs-12 offset-md-3 col-md-6">
      <div className="card">
        <div className="card-body">

          <div>
            <h3>Forgot password?</h3>
            <p>
              Enter the email address associated with your account and we will send you a link to reset your password.
            </p>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  autoComplete="email"
                />
              </div>
              {errors}
              <button className="btn btn-primary">Request Password Reset</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}