import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';
import ConfirmTwoFactorAuth from '../../components/2fa';

export default () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [twoFactAuth, setTwoFactAuth] = React.useState('')
  const [userId, setUserId] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: (result) => handleSignin(result)
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  const handleSignin = (result) => {
    if (result.twoFactorAuthEnabled) {
      setTwoFactAuth(true)
      setUserId(result.id)
    } else {
      Router.push('/')
    }
  }

  if (twoFactAuth) {
    return <ConfirmTwoFactorAuth userId={userId} />
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => setEmail(e.target.value.trim())}
          className="form-control"
          autoComplete="email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => setPassword(e.target.value.trim())}
          className="form-control"
          type="password"
          autoComplete="current-password"
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign In</button>

      <p className="mt-3">
        <Link href="/auth/forgot-password">
          <a>Forgot your password?</a>
        </Link>
      </p>
    </form>
  );
};
