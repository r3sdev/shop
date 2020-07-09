import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import useRequest from '../../hooks/use-request';
import ConfirmTwoFactorAuth from '../../components/2fa';

const Divider = styled.hr`
  position: relative;
  bottom: 1rem;
  margin: 0;
`

const DividerText = styled.span`
  background: white;
  padding: 5px 15px;
  z-index: 1;
`

const Signin = () => {

  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [twoFactAuth, setTwoFactAuth] = React.useState(false)
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
      router.push('/')
    }
  }

  if (twoFactAuth) {
    return <ConfirmTwoFactorAuth userId={userId} />
  }

  return (
    <div className="col-xs-12 offset-md-4 col-md-4 mt-3">

      <div className="card">
        <div className="card-body">
          <h2>Sign In</h2>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => setEmail(e.target.value.trim())}
                className="form-control"
                autoComplete="email"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => setPassword(e.target.value.trim())}
                className="form-control"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
              />
            </div>

            {errors}

            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-primary btn-block">Sign In</button>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <p className="mt-3">
                <Link href="/auth/forgot-password">
                  <a>Forgot your password?</a>
                </Link>
              </p>
            </div>


          </form>
          <div className="d-flex justify-content-center align-items-center">
            <DividerText>New here?</DividerText>
          </div>
          <Divider />

          <div className="d-flex justify-content-center align-items-center">
            <Link href="/auth/signup">
              <a className="btn btn-sm btn-link mt-1">Sign up for a new account</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Signin.getInitialProps = async (context, client, currentUser) => {
  const { res } = context;

  if (res && currentUser) {
    if (currentUser.isAdmin) {
      res.writeHead(301, {
        Location: '/admin'
      });
      return res.end();
    }

    res.writeHead(301, {
      Location: '/'
    });
    res.end();
  }
  return {};
}

export default Signin