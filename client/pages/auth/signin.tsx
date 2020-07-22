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
          <h2 className="text-center">Sign In</h2>

          <form onSubmit={onSubmit} className="pt-3">
            <div className="form-group">
              <span className="has-float-label">
                <input
                  autoComplete="off"
                  autoFocus={true}
                  className="form-control"
                  name="emai"
                  id="email"
                  onBlur={(e) => setEmail(e.target.value.trim())}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  value={email}
                />
                <label htmlFor="email">
                  Email address <span className="required">*</span>
                </label>
              </span>
            </div>

            <div className="form-group">
              <span className="has-float-label">
                <input
                  autoComplete="off"
                  className="form-control"
                  id="password"
                  name="password"
                  onBlur={(e) => setPassword(e.target.value.trim())}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  value={password}
                />
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
              </span>
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