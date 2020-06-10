import React from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/auth/email/confirm')
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className="offset-3 col-6">
      <div class="card">
        <div class="card-body">


          <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => setEmail(e.target.value.trim())}
                className="form-control"
                autoComplete="email"
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => setPassword(e.target.value.trim())}
                className="form-control"
                type="password"
                autoComplete="new-password"
              />
            </div>

            {errors}

            <button className="btn btn-primary">Sign Up</button>
          </form>


        </div>
      </div>
    </div>
  );
};
